"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { gradeLabel } from "@/lib/math/types";

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050805]">
        <p className="text-green-400/60">Không có kết quả bài làm</p>
        <Link
          href="/on-tap-toan"
          className="rounded-lg bg-green-600 px-4 py-2 text-black"
        >
          Về trang ôn tập
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
        <div className="rounded-2xl border border-green-900/40 bg-[#0d120d] p-8 text-center">
          <span className="text-5xl">{emoji}</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-green-50">
            Kết quả bài làm
          </h1>
          <p className="mt-1 text-green-400/60">
            {gradeLabel(result.grade)} · Chân Trời Sáng Tạo
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-green-950/40 p-4">
              <p className="text-3xl font-bold text-green-400">{result.score}</p>
              <p className="text-xs text-green-600">Điểm bài này</p>
            </div>
            <div className="rounded-xl bg-green-950/40 p-4">
              <p className="text-3xl font-bold text-green-400">
                {result.correct}/{result.total}
              </p>
              <p className="text-xs text-green-600">Câu đúng</p>
            </div>
            <div className="rounded-xl bg-green-950/40 p-4">
              <p className="text-3xl font-bold text-green-400">{pct}%</p>
              <p className="text-xs text-green-600">Tỷ lệ đúng</p>
            </div>
          </div>

          {result.scoreSaved && result.user ? (
            <p className="mt-6 text-sm text-green-300/60">
              Tổng điểm của {result.user.name}:{" "}
              <span className="font-semibold text-green-400">
                {result.user.totalScore}
              </span>{" "}
              ({result.user.quizzesCompleted} bài đã làm)
            </p>
          ) : (
            <div className="mt-6 rounded-xl border border-green-800/30 bg-green-950/30 px-4 py-3">
              <p className="text-sm text-green-300/70">
                Điểm chưa được lưu.{" "}
                <Link href="/login" className="font-medium text-green-400 hover:underline">
                  Đăng nhập
                </Link>{" "}
                để cộng điểm vào bảng xếp hạng.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          <h2 className="font-display text-lg font-semibold text-green-50">
            Chi tiết từng câu
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
                    Câu {i + 1}: {r.question}
                  </p>
                  <p className="mt-1 text-xs text-green-500/60">{r.topic}</p>
                  {!r.isCorrect && (
                    <p className="mt-2 text-xs text-green-400/70">
                      Bạn chọn:{" "}
                      <span className="text-red-400">
                        {r.options[r.userAnswer]}
                      </span>
                      {" · "}
                      Đáp án đúng:{" "}
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
            href={`/on-tap-toan/lop-${result.grade}/lam-bai`}
            className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 font-semibold text-black"
          >
            Làm bài mới
          </Link>
          <Link
            href="/bang-xep-hang"
            className="rounded-xl border border-green-800/50 px-6 py-3 text-sm text-green-300"
          >
            🏆 Bảng xếp hạng
          </Link>
          <Link
            href="/on-tap-toan"
            className="rounded-xl border border-green-800/50 px-6 py-3 text-sm text-green-300"
          >
            Chọn lớp khác
          </Link>
        </div>
      </main>
    </div>
  );
}
