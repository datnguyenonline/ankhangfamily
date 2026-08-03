"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

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
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-grid px-4">
      <div className="glow-orb left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 bg-green-600/10" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-xl font-bold text-black shadow-lg shadow-green-500/30">
            AK
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold text-green-50">
            An Khang Family
          </h1>
          <p className="mt-2 text-sm text-green-400/60">
            Đăng nhập để lưu điểm và tham gia bảng xếp hạng
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-green-900/40 bg-[#0d120d]/90 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-green-300/80"
              >
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="giaan, dinhkhang..."
                className="w-full rounded-lg border border-green-900/50 bg-[#050805] px-4 py-3 text-green-50 placeholder:text-green-800 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-green-300/80"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••"
                className="w-full rounded-lg border border-green-900/50 bg-[#050805] px-4 py-3 text-green-50 placeholder:text-green-800 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30"
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
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-green-700/80">
          Không bắt buộc — chỉ cần khi muốn lưu điểm
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
