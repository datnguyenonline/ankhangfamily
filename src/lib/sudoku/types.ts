export type SudokuDifficulty = {
  level: number;
  label: string;
  description: string;
  points: number;
  clues: number;
};

export const SUDOKU_DIFFICULTIES: SudokuDifficulty[] = [
  { level: 1, label: "Cấp 1", description: "Rất dễ — nhiều số gợi ý", points: 5, clues: 46 },
  { level: 2, label: "Cấp 2", description: "Dễ — làm quen luật chơi", points: 10, clues: 44 },
  { level: 3, label: "Cấp 3", description: "Cơ bản — suy luận đơn giản", points: 15, clues: 42 },
  { level: 4, label: "Cấp 4", description: "Trung bình — cần tập trung", points: 20, clues: 40 },
  { level: 5, label: "Cấp 5", description: "Khá — loại trừ nhiều hơn", points: 25, clues: 38 },
  { level: 6, label: "Cấp 6", description: "Tốt — tư duy có hệ thống", points: 30, clues: 36 },
  { level: 7, label: "Cấp 7", description: "Mạnh — ít gợi ý hơn", points: 35, clues: 34 },
  { level: 8, label: "Cấp 8", description: "Rất khó — suy luận sâu", points: 40, clues: 32 },
  { level: 9, label: "Cấp 9", description: "Xuất sắc — thử thách thật sự", points: 45, clues: 30 },
  { level: 10, label: "Cấp 10", description: "Siêu cấp — chuyên gia", points: 50, clues: 28 },
];

export type SudokuGrid = number[][];

export function getDifficulty(level: number): SudokuDifficulty {
  return SUDOKU_DIFFICULTIES[level - 1] ?? SUDOKU_DIFFICULTIES[0];
}

export function pointsForLevel(level: number): number {
  return level * 5;
}

export function createEmptyGrid(): SudokuGrid {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export function cloneGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map((row) => [...row]);
}

export function gridsEqual(a: SudokuGrid, b: SudokuGrid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

export function isGridComplete(grid: SudokuGrid): boolean {
  return grid.every((row) => row.every((cell) => cell >= 1 && cell <= 9));
}
