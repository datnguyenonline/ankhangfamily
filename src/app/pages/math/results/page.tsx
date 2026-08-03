"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/app/components/Header";
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-theme-deep">
        <p className="text-green-400/60">{t("math.noResult")}</p>
        <Link
          href={routes.math}
          className="rounded-lg bg-green-600 px-4 py-2 text-black"
        >
          {t("math.backPractice")}
        </Link>
      </div>
    );
  }

  const pct = Math.round((result.correct / result.total) * 100);
  const emoji =
    pct >= 90 ? "🌟" : pct >= 70 ? "👏" : pct >= 50 ? "💪" : "📚";

  return (
    <div className="relative min-h-screen bg-grid">
      <Header />

      <main className="relative mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-green-900/40 bg-theme-surface p-8 text-center">
          <span className="text-5xl">{emoji}</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-green-50">
            {t("math.resultTitle")}
          </h1>
          <p className="mt-1 text-green-400/60">
            {gradeLabelText(locale, result.grade)} · {t("math.bookName")}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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

        <div className="mt-8 space-y-3">
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
                <span className="text-lg">{r.isCorrect ? "✅" : "❌"}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-100">
                    {t("math.questionN", { n: i + 1 })} {r.question}
                  </p>
                  <p className="mt-1 text-xs text-green-500/60">{r.topic}</p>
                  {!r.isCorrect && (
                    <p className="mt-2 text-xs text-green-400/70">
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

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={routes.mathQuiz(result.grade)}
            className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 font-semibold text-black"
          >
            {t("math.newQuiz")}
          </Link>
          <Link
            href={routes.leaderboard}
            className="rounded-xl border border-green-800/50 px-6 py-3 text-sm text-green-300"
          >
            {t("math.leaderboard")}
          </Link>
          <Link
            href={routes.math}
            className="rounded-xl border border-green-800/50 px-6 py-3 text-sm text-green-300"
          >
            {t("math.otherGrade")}
          </Link>
        </div>
      </main>
    </div>
  );
}
