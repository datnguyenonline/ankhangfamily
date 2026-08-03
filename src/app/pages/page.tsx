import Link from "next/link";
import Image from "next/image";
import beachHero from "@/app/assets/images/beach-hero.png";
import { Header } from "@/app/components/Header";
import { CategoryCard } from "@/app/components/CategoryCard";
import { portalCategories } from "@/lib/data";
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
                  href={routes.math}
                  className="rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-green-900/40 transition-transform active:scale-95 sm:px-8"
                >
                  {t("home.ctaMath")}
                </Link>
                <Link
                  href={routes.chess}
                  className="rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:bg-white/30 sm:px-8"
                >
                  {t("home.ctaChess")}
                </Link>
              </div>
            </div>

            <a
              href="#categories"
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

      <section
        id="categories"
        className="relative bg-theme-deep/95 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold text-green-50 sm:text-3xl">
              {t("home.categories")}
            </h2>
            <p className="mt-2 text-green-400/60">{t("home.categoriesDesc")}</p>
          </div>

          <Link
            href={routes.math}
            className="group mb-8 block overflow-hidden rounded-2xl border border-green-700/40 bg-gradient-to-br from-green-950/60 to-theme-surface p-5 transition-all hover:border-green-500/50 hover:shadow-[0_0_50px_-10px_var(--theme-glow)] sm:p-8"
          >
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <span className="text-4xl sm:text-5xl">🔢</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-widest text-green-500">
                  {t("home.featuredBook")}
                </p>
                <h3 className="font-display text-xl font-bold text-green-50 group-hover:text-green-400 sm:text-2xl">
                  {t("home.featuredTitle")}
                </h3>
                <p className="mt-1 text-sm text-green-300/60">
                  {t("home.featuredDesc")}
                </p>
              </div>
              <span className="hidden text-green-500 transition-transform group-hover:translate-x-1 sm:ml-auto sm:block">
                →
              </span>
            </div>
          </Link>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portalCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        <footer className="border-t border-green-900/20 py-8 text-center text-xs text-green-700">
          {t("home.footer", { year })}
        </footer>
      </section>
    </>
  );
}
