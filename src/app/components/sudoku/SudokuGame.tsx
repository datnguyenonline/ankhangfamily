"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { generateSudoku } from "@/lib/sudoku/generator";
import {
  cloneGrid,
  gridsEqual,
  isGridComplete,
  pointsForLevel,
  SUDOKU_DIFFICULTIES,
  type SudokuGrid,
} from "@/lib/sudoku/types";
import { useTranslation } from "@/lib/i18n/context";
import { useBoardSize } from "@/hooks/useBoardSize";
import { Button } from "@/app/components/ui/Button";
import { FullscreenBottomBar } from "@/app/components/ui/FullscreenBottomBar";
import { GameResultPanel } from "@/app/components/ui/GameResultPanel";
import { interactiveCardClass } from "@/app/components/ui/buttonStyles";

type GamePhase = "menu" | "playing" | "won";

type GameDifficulty = {
  level: number;
  points: number;
  clues: number;
  label: string;
  description: string;
};

export function SudokuGame() {
  const { data: session } = useSession();
  const { t, dictionary } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<SudokuGrid>([]);
  const fixedRef = useRef<boolean[][]>([]);

  const difficulties = useMemo<GameDifficulty[]>(
    () =>
      SUDOKU_DIFFICULTIES.map((level, index) => ({
        level: level.level,
        points: pointsForLevel(level.level),
        clues: level.clues,
        label: dictionary.sudoku.levels[index].label,
        description: dictionary.sudoku.levels[index].description,
      })),
    [dictionary]
  );

  const [phase, setPhase] = useState<GamePhase>("menu");
  const [difficulty, setDifficulty] = useState<GameDifficulty | null>(null);
  const [board, setBoard] = useState<SudokuGrid>([]);
  const [fixed, setFixed] = useState<boolean[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [statusText, setStatusText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [scoreSaved, setScoreSaved] = useState(false);
  const boardSize = useBoardSize(isFullscreen, { min: 360, max: 420 });

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const saveWinScore = useCallback(async (level: number, points: number) => {
    try {
      const res = await fetch("/api/sudoku/win", {
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
    (level: GameDifficulty) => {
      setPhase("won");
      setLastPoints(level.points);
      setStatusText(t("sudoku.complete", { points: level.points }));
      void saveWinScore(level.level, level.points);
    },
    [saveWinScore, t]
  );

  const checkWin = useCallback(
    (nextBoard: SudokuGrid, level: GameDifficulty) => {
      if (!isGridComplete(nextBoard)) return;
      if (gridsEqual(nextBoard, solutionRef.current)) {
        finishWin(level);
      } else {
        setStatusText(t("sudoku.wrongCells"));
      }
    },
    [finishWin, t]
  );

  const startGame = (level: GameDifficulty) => {
    const { puzzle, solution } = generateSudoku(level.clues);
    const fixedCells = puzzle.map((row) => row.map((cell) => cell !== 0));

    solutionRef.current = solution;
    fixedRef.current = fixedCells;
    setDifficulty(level);
    setBoard(cloneGrid(puzzle));
    setFixed(fixedCells);
    setSelected(null);
    setPhase("playing");
    setStatusText(t("sudoku.fillHint"));
    setLastPoints(null);
    setScoreSaved(false);
  };

  const resetToMenu = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    setPhase("menu");
    setDifficulty(null);
    setBoard([]);
    setFixed([]);
    setSelected(null);
    setStatusText("");
    setLastPoints(null);
    setScoreSaved(false);
  };

  const enterFullscreen = () => {
    containerRef.current?.requestFullscreen().catch(() => {});
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
  };

  const setCellValue = (value: number) => {
    if (!selected || !difficulty || phase !== "playing") return;
    const [row, col] = selected;
    if (fixedRef.current[row][col]) return;

    const next = cloneGrid(board);
    next[row][col] = value;
    setBoard(next);
    setStatusText(t("sudoku.continueFill"));
    checkWin(next, difficulty);
  };

  const cellSize = Math.floor(boardSize / 9);

  return (
    <div
      ref={containerRef}
      className={`relative flex min-h-[70vh] flex-col ${
        isFullscreen ? "h-screen w-screen bg-theme-deep px-4 pt-4 pb-24" : ""
      }`}
    >
      {phase === "menu" && !isFullscreen && (
        <div>
          <p className="mb-6 text-green-300/60">{t("sudoku.menuDesc")}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {difficulties.map((d) => (
              <button
                key={d.level}
                type="button"
                onClick={() => startGame(d)}
                className={`${interactiveCardClass} w-full p-4 text-left`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-lg font-bold text-green-50 group-hover:text-green-400">
                    {d.label}
                  </span>
                  <span className="rounded-full bg-green-950/80 px-2.5 py-0.5 text-xs font-semibold text-green-400 ring-1 ring-green-800/40">
                    +{d.points} {t("common.points")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-green-300/55">{d.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase !== "menu" && !isFullscreen && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-500">
              {difficulty?.label}
            </p>
            <p className="mt-1 text-sm text-green-300/70">{statusText}</p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <Button variant="secondary" size="sm" onClick={enterFullscreen}>
              {t("common.fullscreen")}
            </Button>
            <Button variant="secondary" size="sm" onClick={resetToMenu}>
              {t("common.exitGame")}
            </Button>
          </div>
        </div>
      )}

      {phase !== "menu" && (
        <div
          className={`flex flex-1 flex-col items-center justify-center ${
            isFullscreen ? "gap-5" : "gap-6"
          }`}
        >
          {isFullscreen && (
            <div className="text-center">
              <p className="font-display text-xl font-bold text-green-50">
                {difficulty?.label} · +{difficulty?.points} {t("common.points")}
              </p>
              <p className="mt-1 text-sm text-green-300/70">{statusText}</p>
            </div>
          )}

          <div
            className="overflow-hidden rounded-xl border-2 border-green-800/60 shadow-[0_0_40px_-10px_var(--theme-glow)]"
            style={{ width: boardSize, height: boardSize }}
          >
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => {
                  const isSelected =
                    selected?.[0] === rowIndex && selected?.[1] === colIndex;
                  const isGiven = fixed[rowIndex]?.[colIndex];
                  const thickRight = colIndex === 2 || colIndex === 5;
                  const thickBottom = rowIndex === 2 || rowIndex === 5;

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      type="button"
                      disabled={phase === "won" || isGiven}
                      onClick={() => setSelected([rowIndex, colIndex])}
                      className={`flex items-center justify-center text-lg font-semibold transition-colors sm:text-xl ${
                        isGiven
                          ? "cursor-default bg-theme-cell-dark text-green-100"
                          : "cursor-pointer bg-theme-elevated text-green-300 hover:bg-green-950/80"
                      } ${isSelected ? "ring-2 ring-inset ring-green-400" : ""} ${
                        thickRight
                          ? "border-r-2 border-green-700/70"
                          : "border-r border-green-900/40"
                      } ${
                        thickBottom
                          ? "border-b-2 border-green-700/70"
                          : "border-b border-green-900/40"
                      }`}
                      style={{ width: cellSize, height: cellSize }}
                    >
                      {cell > 0 ? cell : ""}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {phase === "playing" && (
            <div className="flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCellValue(num)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-green-800/50 bg-green-950/50 text-sm font-bold text-green-200 hover:border-green-500/50 hover:bg-green-900/60 sm:text-base"
                >
                  {num}
                </button>
              ))}
              <Button variant="ghost" size="md" onClick={() => setCellValue(0)}>
                {t("sudoku.clear")}
              </Button>
            </div>
          )}

          {phase === "won" && (
            <GameResultPanel
              title={t("sudoku.winTitle")}
              points={lastPoints}
              scoreMessage={
                session?.user
                  ? scoreSaved
                    ? t("common.scoreSaved")
                    : t("common.savingScore")
                  : t("common.loginToSave")
              }
              onPlayAgain={() => difficulty && startGame(difficulty)}
              onChooseLevel={resetToMenu}
            />
          )}
        </div>
      )}

      {isFullscreen && (
        <FullscreenBottomBar
          onExitFullscreen={exitFullscreen}
          onExitGame={resetToMenu}
        />
      )}
    </div>
  );
}
