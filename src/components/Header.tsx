"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

type HeaderProps = {
  transparent?: boolean;
};

export function Header({ transparent = false }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header
      className={`sticky top-0 z-50 ${
        transparent
          ? "border-b border-white/10 bg-black/20 backdrop-blur-md"
          : "border-b border-green-900/30 bg-[#050805]/80 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 text-sm font-bold text-black shadow-lg shadow-green-500/20">
            AK
          </span>
          <div>
            <p
              className={`font-display text-lg font-bold tracking-tight ${
                transparent ? "text-white" : "text-green-50"
              }`}
            >
              An Khang Family
            </p>
            <p
              className={`text-[10px] uppercase tracking-[0.2em] ${
                transparent ? "text-white/60" : "text-green-500/70"
              }`}
            >
              Learning Portal
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "/on-tap-toan", label: "Ôn tập Toán" },
            { href: "/bang-xep-hang", label: "Xếp hạng" },
            { href: "/elearning", label: "E-Learning" },
            { href: "/games", label: "Games" },
            { href: "/reading", label: "Reading" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                transparent
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-green-100/70 hover:bg-green-500/10 hover:text-green-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <span
                className={`hidden text-sm sm:block ${
                  transparent ? "text-white/70" : "text-green-300/60"
                }`}
              >
                {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                  transparent
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    : "border-green-800/50 bg-green-950/50 text-green-300 hover:border-green-600/50 hover:bg-green-900/50 hover:text-green-200"
                }`}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 px-3 py-1.5 text-sm font-semibold text-black transition-all hover:from-green-500 hover:to-emerald-400"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
