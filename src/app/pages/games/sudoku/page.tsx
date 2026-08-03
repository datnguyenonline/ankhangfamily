import Link from "next/link";
import { Header } from "@/app/components/Header";
import { SudokuGame } from "@/app/components/sudoku/SudokuGame";
import { routes } from "@/lib/routes";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function SudokuPage() {
  const { t } = await getServerTranslation();

  return (
    <div className="relative min-h-screen bg-grid">
      <div className="glow-orb -left-32 top-20 h-96 w-96 bg-emerald-600/10" />

      <Header />

      <main className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href={routes.games}
          className="mb-6 inline-flex items-center gap-1 text-sm text-green-500/70 hover:text-green-400"
        >
          {t("common.backGames")}
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-green-500">
            {t("sudoku.familyGames")}
          </p>
          <h1 className="font-display text-3xl font-bold text-green-50 sm:text-4xl">
            {t("sudoku.title")}
          </h1>
          <p className="mt-3 max-w-xl text-green-300/60">{t("sudoku.subtitle")}</p>
        </div>

        <SudokuGame />
      </main>
    </div>
  );
}
