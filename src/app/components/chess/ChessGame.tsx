"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useSession } from "next-auth/react";
import { getComputerMove } from "@/lib/chess/ai";
import { pointsForLevel } from "@/lib/chess/types";
import { useTranslation } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import { useBoardSize } from "@/hooks/useBoardSize";
import { Button } from "@/app/components/ui/Button";
import { FullscreenBottomBar } from "@/app/components/ui/FullscreenBottomBar";
import { GameResultPanel } from "@/app/components/ui/GameResultPanel";
import { interactiveCardClass } from "@/app/components/ui/buttonStyles";

type GamePhase = "menu" | "playing" | "won" | "lost" | "draw";

type GameDifficulty = {
  level: number;
  points: number;
  label: string;
  description: string;
};

export function ChessGame() {
  const { data: session } = useSession();
  const { t, dictionary } = useTranslation();
  const { themeConfig } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef(new Chess());
  const aiBusyRef = useRef(false);

  const difficulties = useMemo<GameDifficulty[]>(
    () =>
      dictionary.chess.levels.map((level, index) => ({
        level: index + 1,
        points: pointsForLevel(index + 1),
        label: level.label,
        description: level.description,
      })),
    [dictionary]
  );

  const [phase, setPhase] = useState<GamePhase>("menu");
  const [difficulty, setDifficulty] = useState<GameDifficulty | null>(null);
  const [fen, setFen] = useState(gameRef.current.fen());
  const [statusText, setStatusText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [scoreSaved, setScoreSaved] = useState(false);
  const boardWidth = useBoardSize(isFullscreen, { min: 280, max: 560 });

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const saveWinScore = useCallback(async (level: number, points: number) => {
    try {
      const res = await fetch("/api/chess/win", {
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

  const finishGame = useCallback(
    (result: "won" | "lost" | "draw") => {
      setPhase(result);
      if (result === "won" && difficulty) {
        setLastPoints(difficulty.points);
        void saveWinScore(difficulty.level, difficulty.points);
        setStatusText(t("chess.win", { points: difficulty.points }));
      } else if (result === "lost") {
        setStatusText(t("chess.lose"));
        setLastPoints(null);
        setScoreSaved(false);
      } else {
        setStatusText(t("chess.draw"));
        setLastPoints(null);
        setScoreSaved(false);
      }
    },
    [difficulty, saveWinScore, t]
  );

  const runComputerMove = useCallback(() => {
    const game = gameRef.current;
    if (game.isGameOver() || game.turn() !== "b" || !difficulty) return;

    aiBusyRef.current = true;
    setIsThinking(true);

    window.setTimeout(() => {
      try {
        const move = getComputerMove(game, difficulty.level);
        game.move(move);
        setFen(game.fen());

        if (game.isCheckmate()) {
          finishGame(game.turn() === "w" ? "lost" : "won");
        } else if (game.isDraw()) {
          finishGame("draw");
        } else if (game.isCheck()) {
          setStatusText(t("chess.computerCheck"));
        } else {
          setStatusText(t("chess.yourTurn"));
        }
      } finally {
        aiBusyRef.current = false;
        setIsThinking(false);
      }
    }, 350);
  }, [difficulty, finishGame, t]);

  const startGame = (level: GameDifficulty) => {
    gameRef.current = new Chess();
    setDifficulty(level);
    setFen(gameRef.current.fen());
    setPhase("playing");
    setStatusText(t("chess.yourTurn"));
    setLastPoints(null);
    setScoreSaved(false);
    aiBusyRef.current = false;
    setIsThinking(false);
  };

  const resetToMenu = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setPhase("menu");
    setDifficulty(null);
    setStatusText("");
    setLastPoints(null);
    setScoreSaved(false);
    aiBusyRef.current = false;
    setIsThinking(false);
  };

  const enterFullscreen = () => {
    containerRef.current?.requestFullscreen().catch(() => {});
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
  };

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => {
    if (
      phase !== "playing" ||
      isThinking ||
      aiBusyRef.current ||
      gameRef.current.turn() !== "w"
    ) {
      return false;
    }

    if (!targetSquare) return false;

    const game = gameRef.current;
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (!move) return false;
    } catch {
      return false;
    }

    setFen(game.fen());

    if (game.isCheckmate()) {
      finishGame("won");
      return true;
    }
    if (game.isDraw()) {
      finishGame("draw");
      return true;
    }

    setStatusText(
      game.isCheck() ? t("chess.youCheck") : t("chess.computerThinking")
    );
    runComputerMove();
    return true;
  };

  const canDrag =
    phase === "playing" && !isThinking && gameRef.current.turn() === "w";

  return (
    <div
      ref={containerRef}
      className={`relative flex min-h-[70vh] flex-col ${
        isFullscreen ? "h-screen w-screen bg-theme-deep px-4 pt-4 pb-20" : ""
      }`}
    >
      {!isFullscreen && phase === "menu" && (
        <div>
          <p className="mb-6 text-green-300/60">{t("chess.menuDesc")}</p>
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

      {!isFullscreen && phase !== "menu" && (
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
            isFullscreen ? "gap-4" : "gap-6"
          }`}
        >
          {isFullscreen && (
            <div className="text-center">
              <p className="font-display text-xl font-bold text-green-50">
                {difficulty?.label} · +{difficulty?.points} {t("common.points")}
              </p>
              <p className="mt-1 text-sm text-green-300/70">
                {isThinking ? t("chess.computerThinking") : statusText}
              </p>
            </div>
          )}

          <div
            className="overflow-hidden rounded-xl border border-green-900/50 shadow-[0_0_40px_-10px_var(--theme-glow)]"
            style={{ width: boardWidth, height: boardWidth }}
          >
            <Chessboard
              options={{
                position: fen,
                boardOrientation: "white",
                allowDragging: canDrag,
                onPieceDrop: ({ sourceSquare, targetSquare }) =>
                  onPieceDrop({ sourceSquare, targetSquare }),
                darkSquareStyle: { backgroundColor: themeConfig.chessBoard.dark },
                lightSquareStyle: { backgroundColor: themeConfig.chessBoard.light },
                boardStyle: {
                  borderRadius: "0.75rem",
                  width: boardWidth,
                  height: boardWidth,
                },
                animationDurationInMs: 200,
              }}
            />
          </div>

          {(phase === "won" || phase === "lost" || phase === "draw") && (
            <GameResultPanel
              title={
                phase === "won"
                  ? t("chess.winTitle")
                  : phase === "lost"
                    ? t("chess.loseTitle")
                    : t("chess.drawTitle")
              }
              points={phase === "won" ? lastPoints : null}
              scoreMessage={
                phase === "won"
                  ? session?.user
                    ? scoreSaved
                      ? t("common.scoreSaved")
                      : t("common.savingScore")
                    : t("common.loginToSave")
                  : ""
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
