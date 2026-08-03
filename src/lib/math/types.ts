export type MathQuestion = {
  id: string;
  grade: number;
  book: string;
  question: string;
  options: string[];
  correctIndex: number;
  topic: string;
};

export type UserScore = {
  userId: string;
  username: string;
  name: string;
  totalScore: number;
  quizzesCompleted: number;
  lastPlayedAt: string;
};

export const GRADES = [1, 2, 3, 4, 5] as const;
export type Grade = (typeof GRADES)[number];

export const QUIZ_SIZE = 10;
export const BOOK_NAME = "Chân Trời Sáng Tạo";

export function gradeLabel(grade: number): string {
  return `Lớp ${grade}`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickRandomQuestions(
  questions: MathQuestion[],
  count: number
): MathQuestion[] {
  const shuffled = shuffleArray(questions);
  const picked: MathQuestion[] = [];
  const seenIds = new Set<string>();
  const seenTexts = new Set<string>();

  for (const q of shuffled) {
    const textKey = q.question.trim();
    if (seenIds.has(q.id) || seenTexts.has(textKey)) continue;

    seenIds.add(q.id);
    seenTexts.add(textKey);
    picked.push(q);

    if (picked.length >= count) break;
  }

  return picked;
}

export function assertUniqueQuizQuestions(questions: MathQuestion[]): void {
  const ids = questions.map((q) => q.id);
  const texts = questions.map((q) => q.question.trim());

  if (new Set(ids).size !== ids.length) {
    throw new Error("Quiz contains duplicate question ids");
  }
  if (new Set(texts).size !== texts.length) {
    throw new Error("Quiz contains duplicate question texts");
  }
}

export function calculateScore(correct: number, total: number): number {
  return Math.round((correct / total) * 100);
}
