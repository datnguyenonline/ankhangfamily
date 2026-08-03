import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getQuestionCount } from "@/lib/math/questions";
import { BOOK_NAME, GRADES, QUIZ_SIZE, gradeLabel } from "@/lib/math/types";

type Props = {
  params: Promise<{ grade: string }>;
};

export function generateStaticParams() {
  return GRADES.map((g) => ({ grade: String(g) }));
}

export default async function GradePage({ params }: Props) {
  const { grade: gradeStr } = await params;
  const grade = Number(gradeStr);

  if (!GRADES.includes(grade as (typeof GRADES)[number])) {
    notFound();
  }

  const totalQuestions = getQuestionCount(grade);

  return (
    <div className="relative min-h-screen bg-grid">
      <Header />

      <main className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link
          href="/on-tap-toan"
          className="mb-6 inline-flex items-center gap-1 text-sm text-green-500/70 hover:text-green-400"
        >
          ← Chọn lớp khác
        </Link>

        <div className="rounded-2xl border border-green-900/40 bg-[#0d120d] p-8 text-center">
          <span className="text-5xl">📐</span>
          <p className="mt-4 text-xs uppercase tracking-widest text-green-500">
            {BOOK_NAME}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-green-50">
            {gradeLabel(grade)}
          </h1>
          <p className="mt-4 text-green-300/60">
            Ngân hàng {totalQuestions} câu hỏi trắc nghiệm
          </p>

          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-green-400/70">
            <li className="flex gap-2">
              <span className="text-green-500">✓</span>
              {QUIZ_SIZE} câu ngẫu nhiên mỗi lần làm bài
            </li>
            <li className="flex gap-2">
              <span className="text-green-500">✓</span>
              Điểm được cộng vào bảng xếp hạng
            </li>
            <li className="flex gap-2">
              <span className="text-green-500">✓</span>
              Xem kết quả chi tiết sau khi nộp bài
            </li>
          </ul>

          <Link
            href={`/on-tap-toan/lop-${grade}/lam-bai`}
            className="mt-8 inline-block rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-10 py-3.5 font-semibold text-black transition-all hover:from-green-500 hover:to-emerald-400 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.5)]"
          >
            Bắt đầu làm bài
          </Link>
        </div>
      </main>
    </div>
  );
}
