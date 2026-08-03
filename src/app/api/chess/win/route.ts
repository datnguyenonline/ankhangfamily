import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addScore } from "@/lib/scores";
import { pointsForLevel } from "@/lib/chess/types";

export async function POST(request: Request) {
  const body = await request.json();
  const { level, points } = body as { level: number; points: number };

  if (!level || level < 1 || level > 10) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }

  const expectedPoints = pointsForLevel(level);
  if (points !== expectedPoints) {
    return NextResponse.json({ error: "Invalid points" }, { status: 400 });
  }

  const session = await auth();
  let user = null;
  let scoreSaved = false;

  if (session?.user?.id) {
    user = await addScore(session.user.id, points);
    scoreSaved = true;
  }

  return NextResponse.json({
    level,
    points,
    user,
    scoreSaved,
  });
}
