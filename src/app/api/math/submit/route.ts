import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { mathQuestionsPath } from "@/app/assets/paths";
import { auth } from "@/lib/auth";
import { validateAnswers } from "@/lib/math/questions";
import { calculateScore, type MathQuestion } from "@/lib/math/types";
import { addScore } from "@/lib/scores";

function loadGradeQuestions(grade: number): MathQuestion[] {
  const filePath = mathQuestionsPath(grade);
  return JSON.parse(readFileSync(filePath, "utf-8")) as MathQuestion[];
}

export async function POST(request: Request) {
  const session = await auth();

  const body = await request.json();
  const { grade, questionIds, answers } = body as {
    grade: number;
    questionIds: string[];
    answers: number[];
  };

  if (
    !grade ||
    grade < 1 ||
    grade > 5 ||
    !questionIds?.length ||
    questionIds.length !== answers?.length
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const pool = loadGradeQuestions(grade);
  const questions = questionIds
    .map((id) => pool.find((q) => q.id === id))
    .filter((q): q is MathQuestion => q !== undefined);

  if (questions.length !== questionIds.length) {
    return NextResponse.json({ error: "Invalid questions" }, { status: 400 });
  }

  if (new Set(questionIds).size !== questionIds.length) {
    return NextResponse.json({ error: "Duplicate questions in submission" }, { status: 400 });
  }

  const texts = questions.map((q) => q.question.trim());
  if (new Set(texts).size !== texts.length) {
    return NextResponse.json({ error: "Duplicate questions in submission" }, { status: 400 });
  }

  const { correct, details } = validateAnswers(questions, answers);
  const score = calculateScore(correct, questions.length);

  let user = null;
  let scoreSaved = false;

  if (session?.user?.id) {
    user = await addScore(session.user.id, score);
    scoreSaved = true;
  }

  const results = questions.map((q, i) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    userAnswer: answers[i],
    correctIndex: q.correctIndex,
    isCorrect: details[i],
    topic: q.topic,
  }));

  return NextResponse.json({
    correct,
    total: questions.length,
    score,
    grade,
    results,
    user,
    scoreSaved,
  });
}
