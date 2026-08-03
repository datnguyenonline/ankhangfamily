import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getQuestionCount } from "@/lib/math/questions";
import { parseGradeSlug, gradeSlug } from "@/lib/math/routes";
import { GRADES } from "@/lib/math/types";
import { getServerTranslation } from "@/lib/i18n/server";
import { gradeLabelText } from "@/lib/i18n";

type Props = {
  params: Promise<{ gradeSlug: string }>;
};

export function generateStaticParams() {
  return GRADES.map((g) => ({ gradeSlug: gradeSlug(g) }));
}

export default async function GradePage({ params }: Props) {
  const { gradeSlug: slug } = await params;
  const grade = parseGradeSlug(slug);
  const { t, locale } = await getServerTranslation();

  if (grade === null) {
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
          {t("math.chooseGrade")}
        </Link>

        <div className="rounded-2xl border border-green-900/40 bg-[#0d120d] p-8 text-center">
          <span className="text-5xl">📐</span>
          <p className="mt-4 text-xs uppercase tracking-widest text-green-500">
            {t("math.bookName")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-green-50">
            {gradeLabelText(locale, grade)}
          </h1>
          <p className="mt-4 text-green-300/60">
            {t("math.questionBank", { count: totalQuestions })}
          </p>

          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-green-400/70">
            <li className="flex gap-2">
              <span className="text-green-500">✓</span>
              {t("math.feature1")}
            </li>
            <li className="flex gap-2">
              <span className="text-green-500">✓</span>
              {t("math.feature2")}
            </li>
            <li className="flex gap-2">
              <span className="text-green-500">✓</span>
              {t("math.feature3")}
            </li>
          </ul>

          <Link
            href={`/on-tap-toan/${slug}/lam-bai`}
            className="mt-8 inline-block rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-10 py-3.5 font-semibold text-black transition-all hover:from-green-500 hover:to-emerald-400 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.5)]"
          >
            {t("math.startQuiz")}
          </Link>
        </div>
      </main>
    </div>
  );
}
