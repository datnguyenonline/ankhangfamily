import { gradeSlug } from "@/lib/math/routes";

export const routes = {
  home: "/",
  login: "/login",
  settings: "/settings",
  elearning: "/elearning",
  games: "/games",
  chess: "/games/chess",
  sudoku: "/games/sudoku",
  coding: "/games/coding",
  math: "/math",
  mathResults: "/math/results",
  leaderboard: "/leaderboard",
  typing: "/elearning/typing",
  mathGrade: (grade: number) => `/math/${gradeSlug(grade)}`,
  mathQuiz: (grade: number) => `/math/${gradeSlug(grade)}/quiz`,
} as const;
