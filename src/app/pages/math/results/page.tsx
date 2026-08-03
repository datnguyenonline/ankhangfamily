"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageShell } from "@/app/components/ui/PageShell";
import { Button } from "@/app/components/ui/Button";
import { CenteredState } from "@/app/components/ui/CenteredState";
import { cardClass } from "@/app/components/ui/buttonStyles";
import { gradeLabelText } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n/context";
import { routes } from "@/lib/routes";

type QuizResult = {
  correct: number;
  total: number;
  score: number;
  grade: number;
  scoreSaved: boolean;
  results: Array<{
    id: string;
    question: string;
    options: string[];
    userAnswer: number;
    correctIndex: number;
    isCorrect: boolean;
    topic: string;
  }>;
  user: {
    name: string;
    totalScore: number;
    quizzesCompleted: number;
  } | null;
};

export default function KetQuaPage() {
  const { t, locale } = useTranslation();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("quiz-result");
    if (raw) {
      setResult(JSON.parse(raw));
      sessionStorage.removeItem("quiz-result");
    }
  }, []);

  if (!result) {
    return (
      <CenteredState
        message={t("math.noResult")}
        actionLabel={t("math.backPractice")}
        actionHref={routes.math}
        withHeader
      />
    );
  }

  const pct = Math.round((result.correct / result.total) * 100);
  const emoji =
    pct >= 90 ? "🌟" : pct >= 70 ? "👏" : pct >= 50 ? "💪" : "📚";

  return (
    <PageShell maxWidth="2xl" mainClassName="py-8 sm:py-10">
      <div className={`${cardClass} p-5 text-center sm:p-8`}>
        <span className="text-5xl">{emoji}</span>
        <h1 className="mt-4 font-display text-2xl font-bold text-green-50 sm:text-3xl">
          {t("math.resultTitle")}
        </h1>
        <p className="mt-1 text-green-400/60">
          {gradeLabelText(locale, result.grade)} · {t("math.bookName")}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-xl bg-green-950/40 p-4">
            <p className="text-3xl font-bold text-green-400">{result.score}</p>
            <p className="text-xs text-green-600">{t("math.scoreThisQuiz")}</p>
          </div>
          <div className="rounded-xl bg-green-950/40 p-4">
            <p className="text-3xl font-bold text-green-400">
              {result.correct}/{result.total}
            </p>
            <p className="text-xs text-green-600">{t("math.correctAnswers")}</p>
          </div>
          <div className="rounded-xl bg-green-950/40 p-4">
            <p className="text-3xl font-bold text-green-400">{pct}%</p>
            <p className="text-xs text-green-600">{t("math.accuracy")}</p>
          </div>
        </div>

        {result.scoreSaved && result.user ? (
          <p className="mt-6 text-sm text-green-300/60">
            {t("math.totalScore", { name: result.user.name })}{" "}
            <span className="font-semibold text-green-400">
              {result.user.totalScore}
            </span>{" "}
            (
            {t("leaderboard.quizzesDone", {
              count: result.user.quizzesCompleted,
            })}
            )
          </p>
        ) : (
          <div className="mt-6 rounded-xl border border-green-800/30 bg-green-950/30 px-4 py-3">
            <p className="text-sm text-green-300/70">
              {t("math.scoreNotSaved")}{" "}
              <Link href={routes.login} className="font-medium text-green-400 hover:underline">
                {t("math.loginLink")}
              </Link>{" "}
              {t("math.scoreNotSavedDesc")}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3 sm:mt-8">
        <h2 className="font-display text-lg font-semibold text-green-50">
          {t("math.detailTitle")}
        </h2>
        {result.results.map((r, i) => (
          <div
            key={r.id}
            className={`rounded-xl border p-4 ${
              r.isCorrect
                ? "border-green-800/40 bg-green-950/20"
                : "border-red-900/40 bg-red-950/10"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-lg">{r.isCorrect ? "✅" : "❌"}</span>
              <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-medium text-green-100">
                  {t("math.questionN", { n: i + 1 })} {r.question}
                </p>
                <p className="mt-1 text-xs text-green-500/60">{r.topic}</p>
                {!r.isCorrect && (
                  <p className="mt-2 break-words text-xs text-green-400/70">
                    {t("math.youChose")}{" "}
                    <span className="text-red-400">
                      {r.options[r.userAnswer]}
                    </span>
                    {" · "}
                    {t("math.correctAnswer")}{" "}
                    <span className="text-green-400">
                      {r.options[r.correctIndex]}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
        <Button href={routes.mathQuiz(result.grade)} variant="primary" size="md" className="w-full sm:w-auto">
          {t("math.newQuiz")}
        </Button>
        <Button href={routes.leaderboard} variant="secondary" size="md" className="w-full sm:w-auto">
          {t("math.leaderboard")}
        </Button>
        <Button href={routes.math} variant="secondary" size="md" className="w-full sm:w-auto">
          {t("math.otherGrade")}
        </Button>
      </div>
    </PageShell>
  );
}
