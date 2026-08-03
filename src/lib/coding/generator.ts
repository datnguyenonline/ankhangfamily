import {
  applyCommand,
  isWall,
  maxCommandsForLevel,
  wallCountForLevel,
  type CodingLevel,
  type Command,
  type Direction,
  type Position,
  type RobotState,
} from "./types";

export const CODING_GRID_SIZE = 6;
export const CODING_LEVEL_COUNT = 10;
const MAX_GENERATION_ATTEMPTS = 400;

export { wallCountForLevel };

const CORNER_LAYOUTS: Array<{
  start: Position;
  goal: Position;
  dir: Direction;
}> = [
  { start: { row: 0, col: 0 }, goal: { row: 5, col: 5 }, dir: 1 },
  { start: { row: 0, col: 0 }, goal: { row: 5, col: 5 }, dir: 2 },
  { start: { row: 0, col: 5 }, goal: { row: 5, col: 0 }, dir: 3 },
  { start: { row: 0, col: 5 }, goal: { row: 5, col: 0 }, dir: 2 },
  { start: { row: 5, col: 5 }, goal: { row: 0, col: 0 }, dir: 3 },
  { start: { row: 5, col: 5 }, goal: { row: 0, col: 0 }, dir: 0 },
  { start: { row: 5, col: 0 }, goal: { row: 0, col: 5 }, dir: 1 },
  { start: { row: 5, col: 0 }, goal: { row: 0, col: 5 }, dir: 0 },
];

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function posKey(row: number, col: number) {
  return `${row},${col}`;
}

function wallableCells(
  size: number,
  start: Position,
  goal: Position
): Position[] {
  const cells: Position[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (row === start.row && col === start.col) continue;
      if (row === goal.row && col === goal.col) continue;
      cells.push({ row, col });
    }
  }
  return cells;
}

function isSolvable(level: CodingLevel, maxCommands: number): boolean {
  const commands: Command[] = ["forward", "turnLeft", "turnRight"];
  const queue: { state: RobotState; depth: number }[] = [
    { state: { ...level.start }, depth: 0 },
  ];
  const seen = new Set<string>();

  while (queue.length > 0) {
    const { state, depth } = queue.shift()!;
    if (depth > maxCommands) continue;

    if (state.row === level.goal.row && state.col === level.goal.col) {
      return true;
    }

    const key = `${state.row},${state.col},${state.dir},${depth}`;
    if (seen.has(key)) continue;
    seen.add(key);

    for (const command of commands) {
      const next = applyCommand(state, command);
      if (command === "forward" && isWall(level, next.row, next.col)) {
        continue;
      }
      queue.push({ state: next, depth: depth + 1 });
    }
  }

  return false;
}

function pickCornerLayout(): (typeof CORNER_LAYOUTS)[number] {
  return CORNER_LAYOUTS[Math.floor(Math.random() * CORNER_LAYOUTS.length)];
}

export function generateCodingLevel(level: number): CodingLevel {
  const size = CODING_GRID_SIZE;
  const wallCount = wallCountForLevel(level);
  const maxCommands = maxCommandsForLevel(level);

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const layout = pickCornerLayout();
    const candidates = shuffle(
      wallableCells(size, layout.start, layout.goal)
    );
    const walls = candidates.slice(0, wallCount);

    const candidate: CodingLevel = {
      level,
      size,
      start: { ...layout.start, dir: layout.dir },
      goal: layout.goal,
      walls,
      maxCommands,
    };

    if (isSolvable(candidate, maxCommands)) {
      return candidate;
    }
  }

  return generateCodingLevelFallback(level);
}

function generateCodingLevelFallback(level: number): CodingLevel {
  const size = CODING_GRID_SIZE;
  const maxCommands = maxCommandsForLevel(level);
  const wallCount = wallCountForLevel(level);
  const layout = CORNER_LAYOUTS[0];

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const walls = shuffle(wallableCells(size, layout.start, layout.goal)).slice(
      0,
      wallCount
    );

    const candidate: CodingLevel = {
      level,
      size,
      start: { ...layout.start, dir: layout.dir },
      goal: layout.goal,
      walls,
      maxCommands,
    };

    if (isSolvable(candidate, maxCommands)) {
      return candidate;
    }
  }

  return {
    level,
    size,
    start: { row: 0, col: 0, dir: 1 },
    goal: { row: 5, col: 5 },
    walls: [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
      { row: 3, col: 3 },
      { row: 4, col: 4 },
      { row: 2, col: 4 },
    ].slice(0, wallCount),
    maxCommands,
  };
}
