import Link from "next/link";
import { Header } from "@/components/Header";
import { getQuestionCount } from "@/lib/math/questions";
import { BOOK_NAME, GRADES, gradeLabel } from "@/lib/math/types";

export default function OnTapToanPage() {
  return (
    <div className="relative min-h-screen bg-grid">
      <div className="glow-orb -left-32 top-0 h-96 w-96 bg-green-600/10" />

      <Header />

      <main className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-green-500/70 hover:text-green-400"
        >
          ← Về trang chủ
        </Link>

        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-green-500">
            {BOOK_NAME}
          </p>
          <h1 className="font-display text-4xl font-bold text-green-50">
            Ôn tập Toán
          </h1>
          <p className="mt-3 max-w-xl text-green-300/60">
            Chọn lớp để bắt đầu làm bài. Mỗi lần ôn tập gồm 10 câu hỏi trắc
            nghiệm ngẫu nhiên từ ngân hàng 500 câu.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GRADES.map((grade) => (
            <Link
              key={grade}
              href={`/on-tap-toan/lop-${grade}`}
              className="group rounded-2xl border border-green-900/40 bg-[#0d120d] p-6 transition-all hover:border-green-600/50 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.25)]"
            >
              <span className="text-3xl">🔢</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-green-50 group-hover:text-green-400">
                {gradeLabel(grade)}
              </h2>
              <p className="mt-1 text-sm text-green-400/60">
                {getQuestionCount(grade)} câu hỏi · 10 câu/lần
              </p>
              <p className="mt-4 text-sm font-medium text-green-500 opacity-0 transition-opacity group-hover:opacity-100">
                Bắt đầu ôn tập →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/bang-xep-hang"
            className="rounded-xl border border-green-800/50 bg-green-950/30 px-6 py-3 text-sm font-medium text-green-300 transition-colors hover:border-green-600/50 hover:text-green-200"
          >
            🏆 Bảng xếp hạng
          </Link>
        </div>
      </main>
    </div>
  );
}
