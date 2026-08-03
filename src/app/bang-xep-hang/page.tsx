import Link from "next/link";
import { Header } from "@/components/Header";
import { getLeaderboard } from "@/lib/scores";
import { auth } from "@/lib/auth";

export default async function BangXepHangPage() {
  const [leaderboard, session] = await Promise.all([getLeaderboard(), auth()]);
  const currentUserId = session?.user?.id;

  return (
    <div className="relative min-h-screen bg-grid">
      <div className="glow-orb right-0 top-20 h-72 w-72 bg-green-600/8" />

      <Header />

      <main className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link
          href="/on-tap-toan"
          className="mb-6 inline-flex items-center gap-1 text-sm text-green-500/70 hover:text-green-400"
        >
          ← Về ôn tập Toán
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-green-50">
            🏆 Bảng xếp hạng
          </h1>
          <p className="mt-2 text-green-300/60">
            Xếp hạng theo tổng điểm tích lũy từ các bài ôn tập Toán
          </p>
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
                    : "border-green-900/30 bg-[#0d120d]"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center text-xl">
                  {index < 3 ? medals[index] : (
                    <span className="font-display text-lg font-bold text-green-600">
                      {index + 1}
                    </span>
                  )}
                </span>

                <div className="flex-1">
                  <p className="font-medium text-green-50">
                    {user.name}
                    {isCurrent && (
                      <span className="ml-2 text-xs text-green-500">(Bạn)</span>
                    )}
                  </p>
                  <p className="text-xs text-green-600/60">
                    @{user.username} · {user.quizzesCompleted} bài đã làm
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-green-400">
                    {user.totalScore}
                  </p>
                  <p className="text-xs text-green-600">điểm</p>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboard.every((u) => u.totalScore === 0) && (
          <p className="mt-6 text-center text-sm text-green-600/60">
            Chưa có ai làm bài. Hãy bắt đầu ôn tập Toán!
          </p>
        )}
      </main>
    </div>
  );
}
