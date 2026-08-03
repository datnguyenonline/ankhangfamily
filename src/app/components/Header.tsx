"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AvatarTrigger } from "@/app/components/AvatarTrigger";
import { useTranslation } from "@/lib/i18n/context";
import { routes } from "@/lib/routes";

type HeaderProps = {
  transparent?: boolean;
};

const navLinks = (t: (key: string) => string) => [
  { href: routes.elearning, label: t("nav.elearning") },
  { href: routes.games, label: t("nav.games") },
  { href: routes.leaderboard, label: t("nav.leaderboard") },
];

export function Header({ transparent = false }: HeaderProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = navLinks(t);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const linkClass = (mobile = false) =>
    mobile
      ? "flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm text-green-100/90 hover:bg-green-500/10 hover:text-green-400 active:bg-green-500/15"
      : `flex min-h-10 items-center rounded-md px-3 py-2 text-sm transition-colors ${
          transparent
            ? "text-white/80 hover:bg-white/10 hover:text-white"
            : "text-green-100/70 hover:bg-green-500/10 hover:text-green-400"
        }`;

  return (
    <>
      <header
        className={`sticky top-0 z-50 pt-[env(safe-area-inset-top)] ${
          transparent
            ? "border-b border-white/10 bg-black/20 backdrop-blur-md"
            : "border-b border-green-900/30 bg-theme-deep/80 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
          <Link
            href={routes.home}
            className="group flex min-h-11 min-w-0 items-center gap-2 sm:gap-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 text-xs font-bold text-black shadow-lg shadow-green-500/20 sm:text-sm">
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

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden md:block">
              <AvatarTrigger transparent={transparent} />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg border md:hidden ${
                transparent
                  ? "border-white/20 text-white"
                  : "border-green-800/50 text-green-300"
              }`}
              aria-label={t("nav.menu")}
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
          </div>
        )}
      </header>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label={t("nav.closeMenu")}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
