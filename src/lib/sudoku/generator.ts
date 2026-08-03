import {
  cloneGrid,
  createEmptyGrid,
  type SudokuGrid,
} from "./types";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isValidPlacement(
  grid: SudokuGrid,
  row: number,
  col: number,
  num: number
): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }

  return true;
}

function findEmpty(grid: SudokuGrid): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) return [row, col];
    }
  }
  return null;
}

function fillSolution(grid: SudokuGrid): boolean {
  const empty = findEmpty(grid);
  if (!empty) return true;

  const [row, col] = empty;
  for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (!isValidPlacement(grid, row, col, num)) continue;
    grid[row][col] = num;
    if (fillSolution(grid)) return true;
    grid[row][col] = 0;
  }

  return false;
}

function countSolutions(grid: SudokuGrid, limit = 2): number {
  const empty = findEmpty(grid);
  if (!empty) return 1;

  const [row, col] = empty;
  let count = 0;

  for (let num = 1; num <= 9; num++) {
    if (!isValidPlacement(grid, row, col, num)) continue;
    grid[row][col] = num;
    count += countSolutions(grid, limit);
    grid[row][col] = 0;
    if (count >= limit) return count;
  }

  return count;
}

export function generateSudoku(clues: number): {
  puzzle: SudokuGrid;
  solution: SudokuGrid;
} {
  const solution = createEmptyGrid();
  fillSolution(solution);

  const puzzle = cloneGrid(solution);
  const positions = shuffle(
    Array.from({ length: 81 }, (_, index) => index)
  );

  let remainingClues = 81;

  for (const pos of positions) {
    if (remainingClues <= clues) break;

    const row = Math.floor(pos / 9);
    const col = pos % 9;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    const test = cloneGrid(puzzle);
    if (countSolutions(test, 2) === 1) {
      remainingClues--;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return { puzzle, solution };
}

export function hasConflict(
  grid: SudokuGrid,
  row: number,
  col: number,
  num: number
): boolean {
  if (num === 0) return false;

  for (let i = 0; i < 9; i++) {
    if (i !== col && grid[row][i] === num) return true;
    if (i !== row && grid[i][col] === num) return true;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c] === num) return true;
    }
  }

  return false;
}
