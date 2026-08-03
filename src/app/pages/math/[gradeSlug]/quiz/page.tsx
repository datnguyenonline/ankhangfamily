"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageShell } from "@/app/components/ui/PageShell";
import { BackLink } from "@/app/components/ui/BackLink";
import { Button } from "@/app/components/ui/Button";
import { CenteredState } from "@/app/components/ui/CenteredState";
import { cardClass } from "@/app/components/ui/buttonStyles";
import { routes } from "@/lib/routes";
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
      router.push(routes.mathResults);
    } catch {
      setError(t("math.submitFail"));
      setSubmitting(false);
    }
  }

  if (grade === null) {
    return (
      <CenteredState
        tone="error"
        message={t("math.invalidGrade")}
        actionLabel={t("math.backPractice")}
        actionHref={routes.math}
      />
    );
  }

  if (loading) {
    return (
      <CenteredState message={t("math.loadingQuestions")} withHeader />
    );
  }

  if (error && questions.length === 0) {
    return (
      <CenteredState
        tone="error"
        message={error}
        actionLabel={t("math.retry")}
        onAction={fetchQuiz}
        withHeader
      />
    );
  }

  const q = questions[current];
  const answeredCount = answers.filter((a) => a !== -1).length;

  return (
    <PageShell maxWidth="2xl" mainClassName="py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <BackLink href={routes.mathGrade(grade)} className="mb-0">
          {t("math.backQuiz")}
        </BackLink>
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

      <div className={`${cardClass} p-5 sm:p-8`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-green-950 px-3 py-1 text-xs text-green-500">
            {t("math.questionOf", {
              current: current + 1,
              total: questions.length,
            })}
          </span>
          <span className="text-xs text-green-600/60">{q.topic}</span>
        </div>

        <h2 className="break-words font-display text-lg font-semibold leading-relaxed text-green-50 sm:text-xl md:text-2xl">
          {q.question}
        </h2>

        <div className="mt-6 space-y-3">
          {q.options.map((option, idx) => {
            const selected = answers[current] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => selectAnswer(idx)}
                className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition-all touch-manipulation sm:text-base ${
                  selected
                    ? "border-green-500 bg-green-950/60 text-green-200 ring-2 ring-green-500/30"
                    : "border-green-900/40 bg-theme-deep text-green-300/80 hover:border-green-700/50 hover:bg-green-950/30 active:bg-green-950/40"
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="md"
          className="w-full sm:w-auto"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          {t("math.prev")}
        </Button>

        {current < questions.length - 1 ? (
          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => setCurrent((c) => c + 1)}
            disabled={answers[current] === -1}
          >
            {t("math.nextQuestion")}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={submitting || answers.some((a) => a === -1)}
          >
            {submitting ? t("math.submitting") : t("math.submit")}
          </Button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {questions.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            className={`flex h-11 w-11 items-center justify-center rounded-lg text-xs font-medium transition-colors touch-manipulation ${
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
    </PageShell>
  );
}
