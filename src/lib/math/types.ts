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
  return shuffleArray(questions).slice(0, count);
}

export function calculateScore(correct: number, total: number): number {
  return Math.round((correct / total) * 100);
}
