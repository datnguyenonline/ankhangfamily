import Link from "next/link";
import { Header } from "@/app/components/Header";
import { getLeaderboard } from "@/lib/scores";
import { auth } from "@/lib/auth";
import { routes } from "@/lib/routes";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function BangXepHangPage() {
  const [leaderboard, session, { t }] = await Promise.all([
    getLeaderboard(),
    auth(),
    getServerTranslation(),
  ]);
  const currentUserId = session?.user?.id;

  return (
    <div className="relative min-h-screen bg-grid">
      <div className="glow-orb right-0 top-20 h-72 w-72 bg-green-600/8" />

      <Header />

      <main className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link
          href={routes.math}
          className="mb-6 inline-flex items-center gap-1 text-sm text-green-500/70 hover:text-green-400"
        >
          {t("leaderboard.backMath")}
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-green-50">
            {t("leaderboard.title")}
          </h1>
          <p className="mt-2 text-green-300/60">{t("leaderboard.subtitle")}</p>
          {!currentUserId && (
            <Link
              href={routes.login}
              className="mt-3 inline-block text-sm text-green-500 hover:text-green-400"
            >
              {t("leaderboard.loginCta")}
            </Link>
          )}
        </div>

        <div className="space-y-3">
          {leaderboard.map((user, index) => {
            const isCurrent = user.userId === currentUserId;
            const medals = ["🥇", "🥈", "🥉"];

            return (
              <div
                key={user.userId}
                className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
                  isCurrent
                    ? "border-green-600/50 bg-green-950/40 ring-1 ring-green-600/20"
                    : "border-green-900/30 bg-theme-surface"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center text-xl">
                  {index < 3 ? (
                    medals[index]
                  ) : (
                    <span className="font-display text-lg font-bold text-green-600">
                      {index + 1}
                    </span>
                  )}
                </span>

                <div className="flex-1">
                  <p className="font-medium text-green-50">
                    {user.name}
                    {isCurrent && (
                      <span className="ml-2 text-xs text-green-500">
                        {t("common.you")}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-green-600/60">
                    @{user.username} ·{" "}
                    {t("leaderboard.quizzesDone", {
                      count: user.quizzesCompleted,
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-green-400">
                    {user.totalScore}
                  </p>
                  <p className="text-xs text-green-600">{t("common.points")}</p>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboard.every((u) => u.totalScore === 0) && (
          <p className="mt-6 text-center text-sm text-green-600/60">
            {t("leaderboard.empty")}
          </p>
        )}
      </main>
    </div>
  );
}
