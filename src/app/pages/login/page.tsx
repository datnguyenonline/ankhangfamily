"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import { AvatarTrigger } from "@/app/components/AvatarTrigger";
import { useTranslation } from "@/lib/i18n/context";
import { routes } from "@/lib/routes";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("login.error"));
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-grid px-4">
      <div className="glow-orb left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 bg-green-600/10" />

      <div className="safe-top absolute right-3 top-0 flex items-center gap-2 sm:right-4">
        <AvatarTrigger />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href={routes.home}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-xl font-bold text-black shadow-lg shadow-green-500/30 transition-transform hover:scale-105 active:scale-95"
            aria-label={t("common.backHome")}
          >
            AK
          </Link>
          <h1 className="mt-6 font-display text-3xl font-bold text-green-50">
            An Khang Family
          </h1>
          <p className="mt-2 text-sm text-green-400/60">{t("login.subtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-green-900/40 bg-theme-surface/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-green-300/80"
              >
                {t("login.username")}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder={t("login.usernamePlaceholder")}
                className="w-full rounded-lg border border-green-900/50 bg-theme-deep px-4 py-3 text-green-50 placeholder:text-green-800 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-green-300/80"
              >
                {t("login.password")}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••"
                className="w-full rounded-lg border border-green-900/50 bg-theme-deep px-4 py-3 text-green-50 placeholder:text-green-800 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-950/50 px-4 py-3 text-sm text-red-400 ring-1 ring-red-900/50">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 py-3 font-semibold text-black transition-all hover:from-green-500 hover:to-emerald-400 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.5)] disabled:opacity-50"
            >
              {loading ? t("login.submitting") : t("login.submit")}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-green-700/80">
          {t("login.optional")}{" "}
          <Link href={routes.settings} className="text-green-500 hover:text-green-400">
            {t("nav.settings")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
