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
const MAX_GENERATION_ATTEMPTS = 300;

export { wallCountForLevel };

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

function allCells(size: number): Position[] {
  const cells: Position[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
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

export function generateCodingLevel(level: number): CodingLevel {
  const size = CODING_GRID_SIZE;
  const wallCount = wallCountForLevel(level);
  const maxCommands = maxCommandsForLevel(level);

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const cells = shuffle(allCells(size));
    const startCell = cells[0];
    const goalCell = cells[1];
    const dir = Math.floor(Math.random() * 4) as Direction;
    const walls = cells.slice(2, 2 + wallCount);

    const candidate: CodingLevel = {
      level,
      size,
      start: { ...startCell, dir },
      goal: goalCell,
      walls,
      maxCommands,
    };

    if (isSolvable(candidate, maxCommands)) {
      return candidate;
    }
  }

  return generateCodingLevelFallback(level);
}

/** Sparse layout if random generation fails at high wall counts. */
function generateCodingLevelFallback(level: number): CodingLevel {
  const size = CODING_GRID_SIZE;
  const maxCommands = maxCommandsForLevel(level);
  const wallCount = Math.min(wallCountForLevel(level), size * size - 4);

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const walls: Position[] = [];
    const blocked = new Set<string>();

    while (walls.length < wallCount) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      const key = posKey(row, col);
      if (blocked.has(key)) continue;
      blocked.add(key);
      walls.push({ row, col });
    }

    const free = allCells(size).filter(
      (cell) => !blocked.has(posKey(cell.row, cell.col))
    );
    const [startCell, goalCell] = shuffle(free);
    const dir = Math.floor(Math.random() * 4) as Direction;

    const candidate: CodingLevel = {
      level,
      size,
      start: { ...startCell, dir },
      goal: goalCell,
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
    goal: { row: size - 1, col: size - 1 },
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
