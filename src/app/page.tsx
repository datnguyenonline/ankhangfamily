import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { portalCategories } from "@/lib/data";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function HomePage() {
  const { t } = await getServerTranslation();
  const year = new Date().getFullYear();

  return (
    <>
      <section className="relative min-h-screen">
        <div className="fixed inset-0 -z-10">
          <Image
            src="/images/beach-hero.png"
            alt={t("home.beachAlt")}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/40 to-black/65 backdrop-blur-[2px]" />
        <div className="fixed inset-0 -z-10 bg-emerald-950/20 mix-blend-multiply" />

        <div className="relative flex min-h-screen flex-col">
          <Header transparent />

          <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-8 text-center sm:px-6">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/90 drop-shadow-md">
                {t("home.family")}
              </p>

              <h1 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl">
                {t("home.heroTitle1")}
                <br />
                <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent">
                  {t("home.heroTitle2")}
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 drop-shadow-md sm:text-lg">
                {t("home.heroDesc")}
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/on-tap-toan"
                  className="rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-8 py-3.5 text-sm font-bold text-black shadow-lg shadow-green-900/40 transition-transform hover:scale-105"
                >
                  {t("home.ctaMath")}
                </Link>
                <Link
                  href="/games/co-vua"
                  className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
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
        className="relative bg-[#050805]/95 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold text-green-50 sm:text-3xl">
              {t("home.categories")}
            </h2>
            <p className="mt-2 text-green-400/60">{t("home.categoriesDesc")}</p>
          </div>

          <Link
            href="/on-tap-toan"
            className="group mb-8 block overflow-hidden rounded-2xl border border-green-700/40 bg-gradient-to-br from-green-950/60 to-[#0d120d] p-8 transition-all hover:border-green-500/50 hover:shadow-[0_0_50px_-10px_rgba(34,197,94,0.3)]"
          >
            <div className="flex items-center gap-6">
              <span className="text-5xl">🔢</span>
              <div>
                <p className="text-xs uppercase tracking-widest text-green-500">
                  {t("home.featuredBook")}
                </p>
                <h3 className="font-display text-2xl font-bold text-green-50 group-hover:text-green-400">
                  {t("home.featuredTitle")}
                </h3>
                <p className="mt-1 text-sm text-green-300/60">
                  {t("home.featuredDesc")}
                </p>
              </div>
              <span className="ml-auto hidden text-green-500 transition-transform group-hover:translate-x-1 sm:block">
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
