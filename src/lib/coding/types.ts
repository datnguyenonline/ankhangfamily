export type Direction = 0 | 1 | 2 | 3;

export type Command = "forward" | "turnLeft" | "turnRight";

export type Position = {
  row: number;
  col: number;
};

export type RobotState = Position & {
  dir: Direction;
};

export type CodingLevel = {
  level: number;
  size: number;
  start: RobotState;
  goal: Position;
  walls: Position[];
  maxCommands: number;
};

export type CodingDifficulty = {
  level: number;
  points: number;
  maxCommands: number;
};

export const CODING_DIFFICULTIES: CodingDifficulty[] = [
  { level: 1, points: 5, maxCommands: 16 },
  { level: 2, points: 10, maxCommands: 18 },
  { level: 3, points: 15, maxCommands: 20 },
  { level: 4, points: 20, maxCommands: 22 },
  { level: 5, points: 25, maxCommands: 24 },
  { level: 6, points: 30, maxCommands: 26 },
  { level: 7, points: 35, maxCommands: 28 },
  { level: 8, points: 40, maxCommands: 30 },
  { level: 9, points: 45, maxCommands: 32 },
  { level: 10, points: 50, maxCommands: 34 },
];

export function maxCommandsForLevel(level: number): number {
  return 14 + level * 2;
}

export function wallCountForLevel(level: number): number {
  return 6 + (level - 1) * 2;
}

export const DIRECTION_DELTAS: Record<Direction, Position> = {
  0: { row: -1, col: 0 },
  1: { row: 0, col: 1 },
  2: { row: 1, col: 0 },
  3: { row: 0, col: -1 },
};

export const DIRECTION_ARROWS = ["↑", "→", "↓", "←"] as const;

export function pointsForLevel(level: number): number {
  return level * 5;
}

export function turnLeft(dir: Direction): Direction {
  return ((dir + 3) % 4) as Direction;
}

export function turnRight(dir: Direction): Direction {
  return ((dir + 1) % 4) as Direction;
}

export function isWall(
  level: CodingLevel,
  row: number,
  col: number
): boolean {
  if (row < 0 || col < 0 || row >= level.size || col >= level.size) {
    return true;
  }
  return level.walls.some((wall) => wall.row === row && wall.col === col);
}

export function applyCommand(state: RobotState, command: Command): RobotState {
  if (command === "turnLeft") {
    return { ...state, dir: turnLeft(state.dir) };
  }
  if (command === "turnRight") {
    return { ...state, dir: turnRight(state.dir) };
  }

  const delta = DIRECTION_DELTAS[state.dir];
  return {
    row: state.row + delta.row,
    col: state.col + delta.col,
    dir: state.dir,
  };
}

export type SimulationResult = {
  states: RobotState[];
  reachedGoal: boolean;
  crashed: boolean;
};

export function simulateCommands(
  level: CodingLevel,
  commands: Command[]
): SimulationResult {
  const states: RobotState[] = [{ ...level.start }];
  let current = { ...level.start };

  for (const command of commands) {
    const next = applyCommand(current, command);

    if (command === "forward") {
      if (isWall(level, next.row, next.col)) {
        return { states, reachedGoal: false, crashed: true };
      }
    }

    current = next;
    states.push({ ...current });

    if (
      current.row === level.goal.row &&
      current.col === level.goal.col
    ) {
      return { states, reachedGoal: true, crashed: false };
    }
  }

  return { states, reachedGoal: false, crashed: false };
}
