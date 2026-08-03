import { readFileSync } from "fs";
import { join } from "path";
import type { MathQuestion } from "./types";
import { assertUniqueQuizQuestions, pickRandomQuestions, QUIZ_SIZE } from "./types";

const cache = new Map<number, MathQuestion[]>();

function loadGradeQuestions(grade: number): MathQuestion[] {
  if (cache.has(grade)) return cache.get(grade)!;

  const filePath = join(
    process.cwd(),
    "public",
    "data",
    "math",
    `grade-${grade}.json`
  );
  const raw = readFileSync(filePath, "utf-8");
  const questions = JSON.parse(raw) as MathQuestion[];
  cache.set(grade, questions);
  return questions;
}

export function getRandomQuizQuestions(grade: number): MathQuestion[] {
  const all = loadGradeQuestions(grade);
  const picked = pickRandomQuestions(all, QUIZ_SIZE);
  assertUniqueQuizQuestions(picked);
  return picked;
}

export function getQuestionCount(grade: number): number {
  return loadGradeQuestions(grade).length;
}

export function validateAnswers(
  questions: MathQuestion[],
  answers: number[]
): { correct: number; details: boolean[] } {
  const details = questions.map((q, i) => answers[i] === q.correctIndex);
  const correct = details.filter(Boolean).length;
  return { correct, details };
}
