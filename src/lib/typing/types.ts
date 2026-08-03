export const TYPING_ROUND_SIZE = 10;
export const TYPING_POINTS_PER_WORD = 1;

export function pointsForTyping(correctCount: number): number {
  return correctCount * TYPING_POINTS_PER_WORD;
}
