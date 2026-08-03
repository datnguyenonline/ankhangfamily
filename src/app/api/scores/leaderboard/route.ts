import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLeaderboard } from "@/lib/scores";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leaderboard = await getLeaderboard();
  return NextResponse.json({ leaderboard });
}
