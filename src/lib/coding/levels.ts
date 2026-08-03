import type { CodingLevel } from "./types";

export const CODING_LEVELS: CodingLevel[] = [
  {
    level: 1,
    size: 5,
    start: { row: 2, col: 0, dir: 1 },
    goal: { row: 2, col: 4 },
    walls: [],
    maxCommands: 6,
  },
  {
    level: 2,
    size: 5,
    start: { row: 4, col: 2, dir: 0 },
    goal: { row: 0, col: 2 },
    walls: [],
    maxCommands: 6,
  },
  {
    level: 3,
    size: 5,
    start: { row: 2, col: 4, dir: 3 },
    goal: { row: 2, col: 0 },
    walls: [],
    maxCommands: 6,
  },
  {
    level: 4,
    size: 5,
    start: { row: 0, col: 0, dir: 2 },
    goal: { row: 4, col: 0 },
    walls: [],
    maxCommands: 6,
  },
  {
    level: 5,
    size: 5,
    start: { row: 2, col: 0, dir: 1 },
    goal: { row: 4, col: 4 },
    walls: [{ row: 2, col: 2 }],
    maxCommands: 8,
  },
  {
    level: 6,
    size: 5,
    start: { row: 0, col: 4, dir: 2 },
    goal: { row: 4, col: 0 },
    walls: [
      { row: 2, col: 2 },
      { row: 3, col: 2 },
    ],
    maxCommands: 10,
  },
  {
    level: 7,
    size: 5,
    start: { row: 0, col: 0, dir: 1 },
    goal: { row: 4, col: 4 },
    walls: [
      { row: 0, col: 2 },
      { row: 1, col: 2 },
    ],
    maxCommands: 12,
  },
  {
    level: 8,
    size: 5,
    start: { row: 4, col: 2, dir: 0 },
    goal: { row: 0, col: 2 },
    walls: [
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
    ],
    maxCommands: 12,
  },
  {
    level: 9,
    size: 5,
    start: { row: 4, col: 0, dir: 1 },
    goal: { row: 0, col: 4 },
    walls: [
      { row: 4, col: 3 },
      { row: 3, col: 3 },
      { row: 2, col: 1 },
      { row: 1, col: 3 },
    ],
    maxCommands: 14,
  },
  {
    level: 10,
    size: 5,
    start: { row: 4, col: 4, dir: 0 },
    goal: { row: 0, col: 0 },
    walls: [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 2, col: 3 },
      { row: 3, col: 1 },
    ],
    maxCommands: 16,
  },
];

export function getCodingLevel(level: number): CodingLevel {
  return CODING_LEVELS[level - 1] ?? CODING_LEVELS[0];
}
