"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import { useTranslation } from "@/lib/i18n/context";
import { routes } from "@/lib/routes";

type HeaderProps = {
  transparent?: boolean;
};

const navLinks = (t: (key: string) => string) => [
  { href: routes.elearning, label: t("nav.elearning") },
  { href: routes.games, label: t("nav.games") },
  { href: routes.math, label: t("nav.math") },
  { href: routes.leaderboard, label: t("nav.leaderboard") },
];

export function Header({ transparent = false }: HeaderProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = navLinks(t);

  const linkClass = (mobile = false) =>
    mobile
      ? "block rounded-lg px-3 py-2.5 text-sm text-green-100/90 hover:bg-green-500/10 hover:text-green-400"
      : `rounded-md px-3 py-2 text-sm transition-colors ${
          transparent
            ? "text-white/80 hover:bg-white/10 hover:text-white"
            : "text-green-100/70 hover:bg-green-500/10 hover:text-green-400"
        }`;

  return (
    <header
      className={`sticky top-0 z-50 ${
        transparent
          ? "border-b border-white/10 bg-black/20 backdrop-blur-md"
          : "border-b border-green-900/30 bg-theme-deep/80 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
        <Link href={routes.home} className="group flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 text-xs font-bold text-black shadow-lg shadow-green-500/20 sm:h-9 sm:w-9 sm:text-sm">
            AK
          </span>
          <div className="min-w-0">
            <p
              className={`truncate font-display text-base font-bold tracking-tight sm:text-lg ${
                transparent ? "text-white" : "text-green-50"
              }`}
            >
              An Khang Family
            </p>
            <p
              className={`hidden text-[10px] uppercase tracking-[0.2em] sm:block ${
                transparent ? "text-white/60" : "text-green-500/70"
              }`}
            >
              Learning Portal
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass()}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <ThemeSwitcher transparent={transparent} />
          <LanguageSwitcher transparent={transparent} />
          {session?.user ? (
            <>
              <span
                className={`hidden max-w-[8rem] truncate text-sm lg:block ${
                  transparent ? "text-white/70" : "text-green-300/60"
                }`}
              >
                {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: routes.home })}
                className={`hidden rounded-lg border px-2.5 py-1.5 text-xs transition-all sm:block sm:px-3 sm:text-sm ${
                  transparent
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    : "border-green-800/50 bg-green-950/50 text-green-300 hover:border-green-600/50 hover:bg-green-900/50 hover:text-green-200"
                }`}
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <Link
              href={routes.login}
              className="hidden rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 px-2.5 py-1.5 text-xs font-semibold text-black transition-all hover:from-green-500 hover:to-emerald-400 sm:block sm:px-3 sm:text-sm"
            >
              {t("nav.login")}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`rounded-lg border p-2 md:hidden ${
              transparent
                ? "border-white/20 text-white"
                : "border-green-800/50 text-green-300"
            }`}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className={`border-t px-3 py-3 md:hidden ${
            transparent
              ? "border-white/10 bg-black/40 backdrop-blur-md"
              : "border-green-900/30 bg-theme-deep/95 backdrop-blur-xl"
          }`}
        >
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={linkClass(true)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-green-900/30 pt-3">
            {session?.user ? (
              <button
                onClick={() => signOut({ callbackUrl: routes.home })}
                className="w-full rounded-lg border border-green-800/50 bg-green-950/50 px-3 py-2.5 text-sm text-green-300"
              >
                {t("nav.logout")} ({session.user.name})
              </button>
            ) : (
              <Link
                href={routes.login}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 px-3 py-2.5 text-center text-sm font-semibold text-black"
              >
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
