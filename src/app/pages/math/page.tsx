import Link from "next/link";
import { PageShell } from "@/app/components/ui/PageShell";
import { BackLink } from "@/app/components/ui/BackLink";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { Button } from "@/app/components/ui/Button";
import { interactiveCardClass } from "@/app/components/ui/buttonStyles";
import { routes } from "@/lib/routes";
import { getQuestionCount } from "@/lib/math/questions";
import { GRADES } from "@/lib/math/types";
import { getServerTranslation } from "@/lib/i18n/server";
import { gradeLabelText } from "@/lib/i18n";

export default async function OnTapToanPage() {
  const { t, locale } = await getServerTranslation();

  return (
    <PageShell glow="left">
      <BackLink href={routes.home}>{t("common.backHome")}</BackLink>

      <PageHeader
        eyebrow={t("math.bookName")}
        title={t("math.title")}
        description={t("math.desc")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GRADES.map((grade) => (
          <Link
            key={grade}
            href={routes.mathGrade(grade)}
            className={interactiveCardClass}
          >
            <span className="text-3xl">🔢</span>
            <h2 className="mt-3 font-display text-xl font-bold text-green-50 group-hover:text-green-400 sm:text-2xl">
              {gradeLabelText(locale, grade)}
            </h2>
            <p className="mt-1 text-sm text-green-400/60">
              {t("math.questionsPerGrade", {
                count: getQuestionCount(grade),
              })}
            </p>
            <p className="mt-3 text-sm font-medium text-green-500">
              {t("math.startPractice")} →
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
        <Button href={routes.leaderboard} variant="secondary" size="md">
          {t("math.leaderboard")}
        </Button>
      </div>
    </PageShell>
  );
}
