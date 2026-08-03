import { PageShell } from "@/app/components/ui/PageShell";
import { BackLink } from "@/app/components/ui/BackLink";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { TypingGame } from "@/app/components/typing/TypingGame";
import { routes } from "@/lib/routes";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function TypingPage() {
  const { t } = await getServerTranslation();

  return (
    <PageShell glow="left" mainClassName="py-8 sm:py-14">
      <BackLink href={routes.elearning}>{t("common.backElearning")}</BackLink>

      <PageHeader
        eyebrow={t("typing.familyLearning")}
        title={t("typing.title")}
        description={t("typing.subtitle")}
      />

      <TypingGame />
    </PageShell>
  );
}
