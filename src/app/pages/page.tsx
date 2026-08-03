import Link from "next/link";
import Image from "next/image";
import beachHero from "@/app/assets/images/beach-hero.png";
import { Header } from "@/app/components/Header";
import { ResourceCard } from "@/app/components/ResourceCard";
import { elearningCategory, gamesCategory } from "@/lib/data";
import { routes } from "@/lib/routes";
import { getServerTranslation } from "@/lib/i18n/server";
import { getTheme } from "@/lib/theme/server";
import { getThemeConfig } from "@/lib/theme/themes";
import type { ThemeId } from "@/lib/theme";

const heroAltKeys: Record<ThemeId, "home.heroAltBeach" | "home.heroAltForest" | "home.heroAltMountain"> = {
  beach: "home.heroAltBeach",
  forest: "home.heroAltForest",
  mountain: "home.heroAltMountain",
};

export default async function HomePage() {
  const [{ t }, theme] = await Promise.all([getServerTranslation(), getTheme()]);
  const themeConfig = getThemeConfig(theme);
  const year = new Date().getFullYear();

  return (
    <>
      <section className="relative min-h-screen">
        <div className="fixed inset-0 -z-10">
          {themeConfig.hero.type === "image" ? (
            <Image
              src={beachHero}
              alt={t(heroAltKeys[theme])}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          ) : (
            <div className={`h-full w-full ${themeConfig.hero.className}`} />
          )}
        </div>

        <div className={`fixed inset-0 -z-10 ${themeConfig.heroOverlay}`} />
        <div className={`fixed inset-0 -z-10 ${themeConfig.heroAccent}`} />

        <div className="relative flex min-h-screen flex-col">
          <Header transparent />

          <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-8 text-center sm:px-6">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/90 drop-shadow-md">
                {t("home.family")}
              </p>

              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
                {t("home.heroTitle1")}
                <br />
                <span
                  className={`bg-gradient-to-r ${themeConfig.heroTitleGradient} bg-clip-text text-transparent`}
                >
                  {t("home.heroTitle2")}
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 drop-shadow-md sm:text-lg">
                {t("home.heroDesc")}
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="#elearning"
                  className="rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-green-900/40 transition-transform active:scale-95 sm:px-8"
                >
                  {t("home.ctaMath")}
                </Link>
                <Link
                  href="#games"
                  className="rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:bg-white/30 sm:px-8"
                >
                  {t("home.ctaChess")}
                </Link>
              </div>
            </div>

            <a
              href="#elearning"
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 transition-colors hover:text-white/80"
              aria-label={t("common.scrollDown")}
            >
              <svg
                className="h-6 w-6 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </main>
        </div>
      </section>

      <section className="relative bg-theme-deep/95 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <div id="elearning" className="scroll-mt-20">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl">{elearningCategory.icon}</span>
              <div>
                <h2 className="font-display text-xl font-bold text-green-50 sm:text-2xl">
                  {t("categories.elearning.title")}
                </h2>
                <p className="text-sm text-green-400/60">
                  {t("categories.elearning.subtitle")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {elearningCategory.items.map((item) => (
                <ResourceCard key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link
                href={routes.elearning}
                className="text-sm text-green-500/70 hover:text-green-400"
              >
                {t("home.viewAllElearning")} →
              </Link>
            </div>
          </div>

          <div id="games" className="mt-14 scroll-mt-20 sm:mt-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl">{gamesCategory.icon}</span>
              <div>
                <h2 className="font-display text-xl font-bold text-green-50 sm:text-2xl">
                  {t("categories.games.title")}
                </h2>
                <p className="text-sm text-green-400/60">
                  {t("categories.games.subtitle")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {gamesCategory.items.map((item) => (
                <ResourceCard key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link
                href={routes.games}
                className="text-sm text-green-500/70 hover:text-green-400"
              >
                {t("home.viewAllGames")} →
              </Link>
            </div>
          </div>
        </div>

        <footer className="border-t border-green-900/20 py-8 text-center text-xs text-green-700">
          {t("home.footer", { year })}
        </footer>
      </section>
    </>
  );
}
