"use client";

import { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { generateCodingLevel } from "@/lib/coding/generator";
import {
  CODING_DIFFICULTIES,
  DIRECTION_ARROWS,
  maxCommandsForLevel,
  simulateCommands,
  type Command,
  type CodingLevel,
  type RobotState,
} from "@/lib/coding/types";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/app/components/ui/Button";
import { GameResultPanel } from "@/app/components/ui/GameResultPanel";
import { interactiveCardClass } from "@/app/components/ui/buttonStyles";

type GamePhase = "menu" | "playing" | "won";

type GameLevel = {
  level: number;
  points: number;
  label: string;
  description: string;
  maxCommands: number;
};

const COMMAND_ICONS: Record<Command, string> = {
  forward: "⬆️",
  turnLeft: "↺",
  turnRight: "↻",
};

function wallKey(row: number, col: number) {
  return `${row},${col}`;
}

export function CodingGame() {
  const { data: session } = useSession();
  const { t, dictionary } = useTranslation();

  const levels = useMemo<GameLevel[]>(
    () =>
      CODING_DIFFICULTIES.map((difficulty, index) => ({
        level: difficulty.level,
        points: difficulty.points,
        maxCommands: maxCommandsForLevel(difficulty.level),
        label: dictionary.coding.levels[index].label,
        description: dictionary.coding.levels[index].description,
      })),
    [dictionary]
  );

  const [phase, setPhase] = useState<GamePhase>("menu");
  const [activeLevel, setActiveLevel] = useState<CodingLevel | null>(null);
  const [activeMeta, setActiveMeta] = useState<GameLevel | null>(null);
  const [commands, setCommands] = useState<Command[]>([]);
  const [robot, setRobot] = useState<RobotState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [scoreSaved, setScoreSaved] = useState(false);

  const wallSet = useMemo(() => {
    if (!activeLevel) return new Set<string>();
    return new Set(activeLevel.walls.map((wall) => wallKey(wall.row, wall.col)));
  }, [activeLevel]);

  const startLevel = (level: GameLevel) => {
    const puzzle = generateCodingLevel(level.level);
    setActiveLevel(puzzle);
    setActiveMeta(level);
    setCommands([]);
    setRobot({ ...puzzle.start });
    setPhase("playing");
    setStatusText(t("coding.buildHint"));
    setLastPoints(null);
    setScoreSaved(false);
    setIsRunning(false);
  };

  const saveWinScore = useCallback(async (level: number, points: number) => {
    try {
      const res = await fetch("/api/coding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, points }),
      });
      if (res.ok) {
        const data = await res.json();
        setScoreSaved(data.scoreSaved ?? false);
      }
    } catch {
      setScoreSaved(false);
    }
  }, []);

  const finishWin = useCallback(
    (meta: GameLevel) => {
      setPhase("won");
      setLastPoints(meta.points);
      setStatusText(t("coding.complete", { points: meta.points }));
      void saveWinScore(meta.level, meta.points);
    },
    [saveWinScore, t]
  );

  const addCommand = (command: Command) => {
    if (!activeLevel || isRunning) return;
    if (commands.length >= activeLevel.maxCommands) {
      setStatusText(t("coding.maxCommands"));
      return;
    }
    setCommands((current) => [...current, command]);
    setStatusText(t("coding.buildHint"));
  };

  const clearCommands = () => {
    if (!activeLevel || isRunning) return;
    setCommands([]);
    setRobot({ ...activeLevel.start });
    setStatusText(t("coding.buildHint"));
  };

  const undoCommand = () => {
    if (!activeLevel || isRunning) return;
    setCommands((current) => current.slice(0, -1));
    setRobot({ ...activeLevel.start });
    setStatusText(t("coding.buildHint"));
  };

  const runProgram = async () => {
    if (!activeLevel || isRunning || commands.length === 0) return;

    setIsRunning(true);
    setStatusText(t("coding.running"));
    setRobot({ ...activeLevel.start });

    const result = simulateCommands(activeLevel, commands);

    for (let i = 1; i < result.states.length; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setRobot(result.states[i]);
    }

    setIsRunning(false);

    if (result.crashed) {
      setStatusText(t("coding.crashed"));
      return;
    }

    if (result.reachedGoal) {
      if (activeMeta) finishWin(activeMeta);
      return;
    }

    setStatusText(t("coding.missedGoal"));
  };

  if (phase === "menu") {
    return (
      <div className="mx-auto w-full max-w-lg space-y-4 sm:max-w-2xl">
        <p className="text-center text-sm text-green-300/70">{t("coding.menuDesc")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {levels.map((level) => (
            <button
              key={level.level}
              type="button"
              onClick={() => startLevel(level)}
              className={`${interactiveCardClass} w-full p-4 text-left`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-lg font-bold text-green-50">
                  {level.label}
                </span>
                <span className="shrink-0 rounded-full bg-green-950/80 px-2.5 py-0.5 text-xs font-semibold text-green-400 ring-1 ring-green-800/40">
                  +{level.points} {t("common.points")}
                </span>
              </div>
              <p className="mt-1 text-sm text-green-300/55">{level.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "won" && activeMeta) {
    return (
      <GameResultPanel
        title={t("coding.winTitle")}
        points={lastPoints}
        scoreMessage={
          scoreSaved
            ? t("common.scoreSaved")
            : session?.user
              ? t("coding.scoreFailed")
              : t("common.loginToSave")
        }
        onPlayAgain={() => startLevel(activeMeta)}
        onChooseLevel={() => setPhase("menu")}
      />
    );
  }

  if (!activeLevel || !activeMeta || !robot) return null;

  const cellSize = Math.min(56, Math.floor(336 / activeLevel.size));

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-500">
            {activeMeta.label}
          </p>
          <p className="font-display text-sm font-semibold text-green-50/80">
            +{activeMeta.points} {t("common.points")}
          </p>
        </div>
        <p className="text-sm text-green-500">
          {t("coding.commandCount", {
            count: commands.length,
            max: activeLevel.maxCommands,
          })}
        </p>
      </div>

      <div className="flex justify-center">
        <div
          className="grid gap-1 rounded-xl border border-green-800/50 bg-theme-surface p-2"
          style={{
            gridTemplateColumns: `repeat(${activeLevel.size}, ${cellSize}px)`,
          }}
        >
          {Array.from({ length: activeLevel.size * activeLevel.size }).map((_, index) => {
            const row = Math.floor(index / activeLevel.size);
            const col = index % activeLevel.size;
            const isRobot = robot.row === row && robot.col === col;
            const isGoal =
              activeLevel.goal.row === row && activeLevel.goal.col === col;
            const isWall = wallSet.has(wallKey(row, col));
            const isStart =
              activeLevel.start.row === row && activeLevel.start.col === col;

            return (
              <div
                key={`${row}-${col}`}
                className={`flex items-center justify-center rounded-md border text-xl ${
                  isWall
                    ? "border-green-900/60 bg-green-950/80"
                    : isGoal
                      ? "border-amber-500/50 bg-amber-500/15"
                      : "border-green-900/30 bg-theme-deep"
                }`}
                style={{ width: cellSize, height: cellSize }}
              >
                {isWall ? (
                  <span className="text-base text-green-700">▣</span>
                ) : isRobot ? (
                  <span aria-label="robot">{DIRECTION_ARROWS[robot.dir]}</span>
                ) : isGoal ? (
                  <span aria-label="goal">⭐</span>
                ) : isStart ? (
                  <span className="text-xs text-green-600/50">S</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-10 rounded-lg border border-green-900/30 bg-theme-surface px-3 py-2">
        {commands.length === 0 ? (
          <p className="text-center text-sm text-green-600/60">{t("coding.emptyQueue")}</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {commands.map((command, index) => (
              <span
                key={`${command}-${index}`}
                className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-green-800/40 bg-theme-deep px-2 text-lg"
              >
                {COMMAND_ICONS[command]}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          disabled={isRunning}
          onClick={() => addCommand("forward")}
        >
          {t("coding.forward")}
        </Button>
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          disabled={isRunning}
          onClick={() => addCommand("turnLeft")}
        >
          {t("coding.turnLeft")}
        </Button>
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          disabled={isRunning}
          onClick={() => addCommand("turnRight")}
        >
          {t("coding.turnRight")}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button
          variant="primary"
          size="md"
          className="col-span-2 w-full sm:col-span-2"
          disabled={isRunning || commands.length === 0}
          onClick={() => void runProgram()}
        >
          {t("coding.run")}
        </Button>
        <Button
          variant="ghost"
          size="md"
          className="w-full"
          disabled={isRunning || commands.length === 0}
          onClick={undoCommand}
        >
          {t("coding.undo")}
        </Button>
        <Button
          variant="ghost"
          size="md"
          className="w-full"
          disabled={isRunning || commands.length === 0}
          onClick={clearCommands}
        >
          {t("coding.clear")}
        </Button>
      </div>

      {statusText && (
        <p className="text-center text-sm text-green-400/80">{statusText}</p>
      )}

      <Button variant="ghost" size="md" className="w-full" onClick={() => setPhase("menu")}>
        {t("common.chooseOtherLevel")}
      </Button>
    </div>
  );
}
