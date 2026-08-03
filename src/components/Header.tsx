"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-green-900/30 bg-[#050805]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 text-sm font-bold text-black shadow-lg shadow-green-500/20">
            AK
          </span>
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-green-50">
              An Khang Family
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-green-500/70">
              Learning Portal
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "/elearning", label: "E-Learning" },
            { href: "/games", label: "Games" },
            { href: "/reading", label: "Reading" },
            { href: "/videos", label: "Videos" },
            { href: "/creativity", label: "Creativity" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-green-100/70 transition-colors hover:bg-green-500/10 hover:text-green-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {session?.user && (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-green-300/60 sm:block">
              {session.user.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg border border-green-800/50 bg-green-950/50 px-3 py-1.5 text-sm text-green-300 transition-all hover:border-green-600/50 hover:bg-green-900/50 hover:text-green-200"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
