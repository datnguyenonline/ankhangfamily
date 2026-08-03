import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRandomQuizQuestions } from "@/lib/math/questions";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const grade = Number(searchParams.get("grade"));

  if (!grade || grade < 1 || grade > 5) {
    return NextResponse.json({ error: "Invalid grade" }, { status: 400 });
  }

  const questions = getRandomQuizQuestions(grade).map((q) => ({
    id: q.id,
    grade: q.grade,
    book: q.book,
    question: q.question,
    options: q.options,
    topic: q.topic,
  }));

  return NextResponse.json({ questions, count: questions.length });
}
