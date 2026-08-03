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
  const [boardSize, setBoardSize] = useState(360);

  const updateBoardSize = useCallback(() => {
    const padding = isFullscreen ? 48 : 32;
    const max = isFullscreen
      ? Math.min(window.innerWidth, window.innerHeight - 220) - padding
      : Math.min(window.innerWidth - 48, 420);
    setBoardSize(Math.max(280, Math.floor(max)));
  }, [isFullscreen]);

  useEffect(() => {
    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
  }, [updateBoardSize]);

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
        isFullscreen ? "h-screen w-screen bg-[#050805] px-4 pt-4 pb-24" : ""
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
                className="group rounded-xl border border-green-900/40 bg-[#0d120d] p-4 text-left transition-all hover:border-green-600/50 hover:shadow-[0_0_30px_-10px_rgba(34,197,94,0.25)]"
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
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={enterFullscreen}
              className="rounded-lg border border-green-800/50 bg-green-950/40 px-3 py-1.5 text-sm text-green-300 hover:border-green-600/50"
            >
              {t("common.fullscreen")}
            </button>
            <button
              type="button"
              onClick={resetToMenu}
              className="rounded-lg border border-green-800/50 bg-green-950/40 px-3 py-1.5 text-sm text-green-300 hover:border-green-600/50"
            >
              {t("common.exitGame")}
            </button>
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
            className="overflow-hidden rounded-xl border-2 border-green-800/60 shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)]"
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
                          ? "cursor-default bg-[#0a1a0a] text-green-100"
                          : "cursor-pointer bg-[#111811] text-green-300 hover:bg-green-950/80"
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
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-800/50 bg-green-950/50 text-sm font-bold text-green-200 hover:border-green-500/50 hover:bg-green-900/60 sm:h-11 sm:w-11 sm:text-base"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCellValue(0)}
                className="rounded-lg border border-green-800/50 bg-green-950/30 px-4 py-2 text-sm text-green-400 hover:border-green-600/50"
              >
                {t("sudoku.clear")}
              </button>
            </div>
          )}

          {phase === "won" && (
            <div className="w-full max-w-md rounded-xl border border-green-800/40 bg-[#0d120d] p-5 text-center">
              <p className="font-display text-2xl font-bold text-green-50">
                {t("sudoku.winTitle")}
              </p>
              {lastPoints !== null && (
                <p className="mt-2 text-green-400">
                  +{lastPoints} {t("common.points")}
                </p>
              )}
              <p className="mt-1 text-sm text-green-300/60">
                {session?.user
                  ? scoreSaved
                    ? t("common.scoreSaved")
                    : t("common.savingScore")
                  : t("common.loginToSave")}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => difficulty && startGame(difficulty)}
                  className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-black"
                >
                  {t("common.playAgain")}
                </button>
                <button
                  type="button"
                  onClick={resetToMenu}
                  className="rounded-lg border border-green-800/50 px-4 py-2 text-sm text-green-300"
                >
                  {t("common.chooseOtherLevel")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isFullscreen && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-3 border-t border-green-900/50 bg-[#050805]/95 px-4 py-3 backdrop-blur-xl">
          <button
            type="button"
            onClick={exitFullscreen}
            className="rounded-lg border border-green-700/50 bg-green-950/60 px-4 py-2.5 text-sm font-medium text-green-200 hover:border-green-500/50"
          >
            {t("common.exitFullscreen")}
          </button>
          <button
            type="button"
            onClick={resetToMenu}
            className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-2.5 text-sm font-medium text-red-300 hover:border-red-600/50"
          >
            {t("common.exitGame")}
          </button>
        </div>
      )}
    </div>
  );
}
