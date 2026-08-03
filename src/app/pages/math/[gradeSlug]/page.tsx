import { notFound } from "next/navigation";
import { PageShell } from "@/app/components/ui/PageShell";
import { BackLink } from "@/app/components/ui/BackLink";
import { Button } from "@/app/components/ui/Button";
import { cardClass } from "@/app/components/ui/buttonStyles";
import { getQuestionCount } from "@/lib/math/questions";
import { parseGradeSlug, gradeSlug } from "@/lib/math/routes";
import { GRADES } from "@/lib/math/types";
import { routes } from "@/lib/routes";
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
    <PageShell maxWidth="2xl">
      <BackLink href={routes.math}>{t("math.chooseGrade")}</BackLink>

      <div className={`${cardClass} p-6 text-center sm:p-8`}>
        <span className="text-5xl">📐</span>
        <p className="mt-4 text-xs uppercase tracking-widest text-green-500">
          {t("math.bookName")}
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-green-50 sm:text-3xl">
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

        <Button
          href={routes.mathQuiz(grade)}
          variant="primary"
          size="lg"
          className="mt-8 w-full sm:w-auto"
        >
          {t("math.startQuiz")}
        </Button>
      </div>
    </PageShell>
  );
}
