import { PageShell } from "@/app/components/ui/PageShell";
import { BackLink } from "@/app/components/ui/BackLink";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SudokuGame } from "@/app/components/sudoku/SudokuGame";
import { routes } from "@/lib/routes";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function SudokuPage() {
  const { t } = await getServerTranslation();

  return (
    <PageShell glow="left" mainClassName="py-8 sm:py-14">
      <BackLink href={routes.games}>{t("common.backGames")}</BackLink>

      <PageHeader
        eyebrow={t("sudoku.familyGames")}
        title={t("sudoku.title")}
        description={t("sudoku.subtitle")}
      />

      <SudokuGame />
    </PageShell>
  );
}
