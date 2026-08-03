export type ChessDifficulty = {
  level: number;
  label: string;
  description: string;
  points: number;
};

export const CHESS_DIFFICULTIES: ChessDifficulty[] = [
  { level: 1, label: "Cấp 1", description: "Mới học — đi ngẫu nhiên", points: 5 },
  { level: 2, label: "Cấp 2", description: "Dễ — thỉnh thoảng ăn quân", points: 10 },
  { level: 3, label: "Cấp 3", description: "Cơ bản — ưu tiên ăn quân", points: 15 },
  { level: 4, label: "Cấp 4", description: "Trung bình — nhìn 1 nước", points: 20 },
  { level: 5, label: "Cấp 5", description: "Khá — nhìn 2 nước", points: 25 },
  { level: 6, label: "Cấp 6", description: "Tốt — chiến thuật cơ bản", points: 30 },
  { level: 7, label: "Cấp 7", description: "Mạnh — nhìn 3 nước", points: 35 },
  { level: 8, label: "Cấp 8", description: "Rất mạnh — phòng thủ tốt", points: 40 },
  { level: 9, label: "Cấp 9", description: "Xuất sắc — nhìn 4 nước", points: 45 },
  { level: 10, label: "Cấp 10", description: "Siêu cấp — nhìn 5 nước", points: 50 },
];

export function getDifficulty(level: number): ChessDifficulty {
  return CHESS_DIFFICULTIES[level - 1] ?? CHESS_DIFFICULTIES[0];
}

export function pointsForLevel(level: number): number {
  return level * 5;
}
