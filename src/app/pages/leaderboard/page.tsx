import Link from "next/link";
import { PageShell } from "@/app/components/ui/PageShell";
import { BackLink } from "@/app/components/ui/BackLink";
import { PageHeader } from "@/app/components/ui/PageHeader";
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
    <PageShell maxWidth="2xl" glow="right">
      <BackLink href={routes.math}>{t("leaderboard.backMath")}</BackLink>

      <PageHeader
        title={t("leaderboard.title")}
        description={t("leaderboard.subtitle")}
      />

      {!currentUserId && (
        <Link
          href={routes.login}
          className="mb-6 inline-flex min-h-11 items-center text-sm text-green-500 hover:text-green-400"
        >
          {t("leaderboard.loginCta")}
        </Link>
      )}

      <div className="space-y-3">
        {leaderboard.map((user, index) => {
          const isCurrent = user.userId === currentUserId;
          const medals = ["🥇", "🥈", "🥉"];

          return (
            <div
              key={user.userId}
              className={`flex items-center gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4 ${
                isCurrent
                  ? "border-green-600/50 bg-green-950/40 ring-1 ring-green-600/20"
                  : "border-green-900/30 bg-theme-surface"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-xl">
                {index < 3 ? (
                  medals[index]
                ) : (
                  <span className="font-display text-lg font-bold text-green-600">
                    {index + 1}
                  </span>
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-green-50">
                  {user.name}
                  {isCurrent && (
                    <span className="ml-2 text-xs text-green-500">
                      {t("common.you")}
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-green-600/60">
                  @{user.username} ·{" "}
                  {t("leaderboard.quizzesDone", {
                    count: user.quizzesCompleted,
                  })}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-display text-xl font-bold text-green-400 sm:text-2xl">
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
    </PageShell>
  );
}
