import { PageShell } from "@/app/components/ui/PageShell";
import { BackLink } from "@/app/components/ui/BackLink";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { ChessGame } from "@/app/components/chess/ChessGame";
import { routes } from "@/lib/routes";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function CoVuaPage() {
  const { t } = await getServerTranslation();

  return (
    <PageShell glow="right" mainClassName="py-8 sm:py-14">
      <BackLink href={routes.games}>{t("common.backGames")}</BackLink>

      <PageHeader
        eyebrow={t("chess.familyGames")}
        title={t("chess.title")}
        description={t("chess.subtitle")}
      />

      <ChessGame />
    </PageShell>
  );
}
