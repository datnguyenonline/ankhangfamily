"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { pickWords, TYPING_GRADES, type TypingGrade } from "@/lib/typing/words";
import {
  pointsForTyping,
  TYPING_ROUND_SIZE,
} from "@/lib/typing/types";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/app/components/ui/Button";
import { GameResultPanel } from "@/app/components/ui/GameResultPanel";
import { interactiveCardClass } from "@/app/components/ui/buttonStyles";

type GamePhase = "menu" | "playing" | "done";

export function TypingGame() {
  const { data: session } = useSession();
  const { t, dictionary } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<GamePhase>("menu");
  const [grade, setGrade] = useState<TypingGrade | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [scoreSaved, setScoreSaved] = useState(false);

  const grades = useMemo(
    () =>
      TYPING_GRADES.map((level) => ({
        level,
        label: dictionary.typing.levels[level - 1].label,
        description: dictionary.typing.levels[level - 1].description,
      })),
    [dictionary]
  );

  const startRound = useCallback((selectedGrade: TypingGrade) => {
    setGrade(selectedGrade);
    setWords(pickWords(selectedGrade, TYPING_ROUND_SIZE));
    setIndex(0);
    setInput("");
    setCorrectCount(0);
    setFeedback(null);
    setLastPoints(null);
    setScoreSaved(false);
    setPhase("playing");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const finishRound = useCallback(
    async (finalCorrect: number, selectedGrade: TypingGrade) => {
      const points = pointsForTyping(finalCorrect);
      setLastPoints(points);
      setPhase("done");

      if (points > 0 && session?.user?.id) {
        try {
          const res = await fetch("/api/typing/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              grade: selectedGrade,
              correctCount: finalCorrect,
              points,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setScoreSaved(data.scoreSaved ?? false);
          }
        } catch {
          setScoreSaved(false);
        }
      }
    },
    [session?.user?.id]
  );

  const submitWord = useCallback(() => {
    if (phase !== "playing" || !grade || words.length === 0) return;

    const target = words[index];
    const normalizedInput = input.trim();
    const isCorrect = normalizedInput === target;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);

    setFeedback(isCorrect ? "correct" : "wrong");

    if (index + 1 >= words.length) {
      finishRound(nextCorrect, grade);
      return;
    }

    setCorrectCount(nextCorrect);
    setIndex((current) => current + 1);
    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [correctCount, finishRound, grade, index, input, phase, words]);

  const currentWord = words[index] ?? "";

  if (phase === "menu") {
    return (
      <div className="mx-auto w-full max-w-lg space-y-4">
        <p className="text-center text-sm text-green-300/70">
          {t("typing.menuDesc")}
        </p>
        <div className="grid gap-3">
          {grades.map((item) => (
            <button
              key={item.level}
              type="button"
              onClick={() => startRound(item.level)}
              className={`${interactiveCardClass} w-full p-4 text-left`}
            >
              <p className="font-display text-lg font-semibold text-green-50">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-green-400/70">{item.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <GameResultPanel
        title={t("typing.doneTitle")}
        points={lastPoints}
        scoreMessage={
          scoreSaved
            ? t("typing.scoreSaved")
            : session?.user
              ? t("typing.scoreFailed")
              : t("typing.loginToSave")
        }
        onPlayAgain={() => grade && startRound(grade)}
        onChooseLevel={() => setPhase("menu")}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div className="flex items-center justify-between text-sm text-green-400/80">
        <span>
          {grade ? dictionary.typing.levels[grade - 1].label : ""}
        </span>
        <span>
          {t("typing.progress", {
            current: index + 1,
            total: words.length,
          })}
        </span>
      </div>

      <div className="rounded-2xl border border-green-800/40 bg-theme-surface p-6 text-center sm:p-8">
        <p className="text-sm text-green-400/70">{t("typing.typeThis")}</p>
        <p className="mt-3 font-display text-4xl font-bold tracking-wide text-green-50 sm:text-5xl">
          {currentWord}
        </p>
      </div>

      <div className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setFeedback(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submitWord();
            }
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
          placeholder={t("typing.placeholder")}
          className="min-h-14 w-full rounded-xl border border-green-800/50 bg-theme-elevated px-4 text-center text-2xl text-green-50 outline-none ring-green-500/30 placeholder:text-green-700 focus:ring-2"
        />

        {feedback === "correct" && (
          <p className="text-center text-sm text-green-400">{t("typing.correct")}</p>
        )}
        {feedback === "wrong" && (
          <p className="text-center text-sm text-amber-400">
            {t("typing.wrong", { word: currentWord })}
          </p>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={submitWord}
          disabled={!input.trim()}
        >
          {index + 1 >= words.length ? t("typing.finish") : t("typing.check")}
        </Button>
      </div>

      <p className="text-center text-xs text-green-600/60">
        {t("typing.correctSoFar", { count: correctCount })}
      </p>
    </div>
  );
}
