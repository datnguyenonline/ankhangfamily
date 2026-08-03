import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addScore } from "@/lib/scores";
import {
  pointsForTyping,
  TYPING_ROUND_SIZE,
} from "@/lib/typing/types";
import { TYPING_GRADES } from "@/lib/typing/words";

export async function POST(request: Request) {
  const body = await request.json();
  const { grade, correctCount, points } = body as {
    grade: number;
    correctCount: number;
    points: number;
  };

  if (
    !TYPING_GRADES.includes(grade as (typeof TYPING_GRADES)[number]) ||
    typeof correctCount !== "number" ||
    correctCount < 0 ||
    correctCount > TYPING_ROUND_SIZE
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const expectedPoints = pointsForTyping(correctCount);
  if (points !== expectedPoints) {
    return NextResponse.json({ error: "Invalid points" }, { status: 400 });
  }

  const session = await auth();
  let user = null;
  let scoreSaved = false;

  if (session?.user?.id && points > 0) {
    user = await addScore(session.user.id, points);
    scoreSaved = true;
  }

  return NextResponse.json({
    grade,
    correctCount,
    points,
    user,
    scoreSaved,
  });
}
