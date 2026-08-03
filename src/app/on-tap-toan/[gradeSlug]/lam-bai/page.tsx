"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { gradeLabelText } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n/context";
import { parseGradeSlug } from "@/lib/math/routes";

type QuizQuestion = {
  id: string;
  grade: number;
  book: string;
  question: string;
  options: string[];
  topic: string;
};

export default function LamBaiPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const gradeSlug = params.gradeSlug as string;
  const grade = useMemo(() => parseGradeSlug(gradeSlug), [gradeSlug]);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchQuiz = useCallback(async () => {
    if (grade === null) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/math/quiz?grade=${grade}`);
      if (!res.ok) throw new Error(t("math.fetchError"));
      const data = await res.json();
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(-1));
      setCurrent(0);
    } catch {
      setError(t("math.loadError"));
    } finally {
      setLoading(false);
    }
  }, [grade, t]);

  useEffect(() => {
    if (grade === null) {
      setLoading(false);
      setError(t("math.invalidGrade"));
      return;
    }
    fetchQuiz();
  }, [grade, fetchQuiz, t]);

  function selectAnswer(optionIndex: number) {
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);
  }

  async function handleSubmit() {
    if (grade === null) return;
    if (answers.some((a) => a === -1)) {
      setError(t("math.answerAll"));
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/math/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          questionIds: questions.map((q) => q.id),
          answers,
        }),
      });

      if (!res.ok) throw new Error(t("math.submitFailed"));
      const data = await res.json();
      sessionStorage.setItem("quiz-result", JSON.stringify(data));
      router.push("/on-tap-toan/ket-qua");
    } catch {
      setError(t("math.submitFail"));
      setSubmitting(false);
    }
  }

  if (grade === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050805]">
        <p className="text-red-400">{t("math.invalidGrade")}</p>
        <Link href="/on-tap-toan" className="rounded-lg bg-green-600 px-4 py-2 text-black">
          {t("math.backPractice")}
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050805]">
        <p className="text-green-400">{t("math.loadingQuestions")}</p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050805]">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchQuiz}
          className="rounded-lg bg-green-600 px-4 py-2 text-black"
        >
          {t("math.retry")}
        </button>
      </div>
    );
  }

  const q = questions[current];
  const answeredCount = answers.filter((a) => a !== -1).length;

  return (
    <div className="relative min-h-screen bg-grid">
      <Header />

      <main className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/on-tap-toan/${gradeSlug}`}
            className="text-sm text-green-500/70 hover:text-green-400"
          >
            {t("math.backQuiz")}
          </Link>
          <span className="text-sm text-green-400/60">
            {gradeLabelText(locale, grade)} ·{" "}
            {t("math.answeredProgress", {
              answered: answeredCount,
              total: questions.length,
            })}
          </span>
        </div>

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-green-950">
          <div
            className="h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all"
            style={{
              width: `${((current + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="rounded-2xl border border-green-900/40 bg-[#0d120d] p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-green-950 px-3 py-1 text-xs text-green-500">
              {t("math.questionOf", {
                current: current + 1,
                total: questions.length,
              })}
            </span>
            <span className="text-xs text-green-600/60">{q.topic}</span>
          </div>

          <h2 className="font-display text-xl font-semibold leading-relaxed text-green-50 sm:text-2xl">
            {q.question}
          </h2>

          <div className="mt-6 space-y-3">
            {q.options.map((option, idx) => {
              const selected = answers[current] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(idx)}
                  className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition-all sm:text-base ${
                    selected
                      ? "border-green-500 bg-green-950/60 text-green-200 ring-2 ring-green-500/30"
                      : "border-green-900/40 bg-[#050805] text-green-300/80 hover:border-green-700/50 hover:bg-green-950/30"
                  }`}
                >
                  <span className="mr-2 font-medium text-green-500">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-400">{error}</p>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="rounded-lg border border-green-800/50 px-5 py-2.5 text-sm text-green-300 disabled:opacity-30"
          >
            {t("math.prev")}
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={answers[current] === -1}
              className="rounded-lg bg-green-800/50 px-5 py-2.5 text-sm font-medium text-green-200 disabled:opacity-30"
            >
              {t("math.nextQuestion")}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || answers.some((a) => a === -1)}
              className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
            >
              {submitting ? t("math.submitting") : t("math.submit")}
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                idx === current
                  ? "bg-green-600 text-black"
                  : answers[idx] !== -1
                    ? "bg-green-900/60 text-green-300"
                    : "bg-green-950/40 text-green-600"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
