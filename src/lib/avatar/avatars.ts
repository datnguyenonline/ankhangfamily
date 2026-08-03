import type { AvatarId, AvatarOption } from "./types";

export const AVATARS: AvatarOption[] = [
  { id: 1, emoji: "🐻", bg: "from-amber-500 to-orange-600" },
  { id: 2, emoji: "🐰", bg: "from-pink-400 to-rose-500" },
  { id: 3, emoji: "🐱", bg: "from-violet-400 to-purple-600" },
  { id: 4, emoji: "🐶", bg: "from-yellow-500 to-amber-600" },
  { id: 5, emoji: "🦊", bg: "from-orange-400 to-red-500" },
  { id: 6, emoji: "🐼", bg: "from-slate-400 to-slate-600" },
  { id: 7, emoji: "🐨", bg: "from-gray-400 to-gray-600" },
  { id: 8, emoji: "🦁", bg: "from-amber-400 to-yellow-600" },
  { id: 9, emoji: "🐯", bg: "from-orange-500 to-amber-700" },
  { id: 10, emoji: "🐸", bg: "from-green-400 to-emerald-600" },
  { id: 11, emoji: "🦄", bg: "from-fuchsia-400 to-pink-600" },
  { id: 12, emoji: "🐙", bg: "from-rose-400 to-red-600" },
  { id: 13, emoji: "🐬", bg: "from-sky-400 to-blue-600" },
  { id: 14, emoji: "🦋", bg: "from-indigo-400 to-violet-600" },
  { id: 15, emoji: "🐝", bg: "from-yellow-300 to-amber-500" },
  { id: 16, emoji: "🌻", bg: "from-lime-400 to-yellow-500" },
  { id: 17, emoji: "🌈", bg: "from-cyan-400 to-blue-500" },
  { id: 18, emoji: "⭐", bg: "from-yellow-400 to-orange-500" },
  { id: 19, emoji: "🚀", bg: "from-blue-500 to-indigo-700" },
  { id: 20, emoji: "🎈", bg: "from-red-400 to-rose-600" },
];

export function getAvatar(id: AvatarId): AvatarOption {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}

export function isAvatarId(value: number): value is AvatarId {
  return Number.isInteger(value) && value >= 1 && value <= 20;
}
