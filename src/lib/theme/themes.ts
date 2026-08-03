import type { ThemeConfig, ThemeId } from "./types";

import beachHero from "@/app/assets/images/beach-hero.png";

export const themeConfigs: Record<ThemeId, ThemeConfig> = {
  beach: {
    id: "beach",
    emoji: "🌊",
    chessBoard: { dark: "#0c2a3a", light: "#1a4555" },
    hero: { type: "image", src: beachHero.src },
    heroOverlay:
      "bg-gradient-to-b from-black/55 via-cyan-950/35 to-black/65 backdrop-blur-[2px]",
    heroAccent: "bg-cyan-950/25 mix-blend-multiply",
    heroTitleGradient: "from-cyan-300 via-teal-200 to-emerald-300",
  },
  forest: {
    id: "forest",
    emoji: "🌲",
    chessBoard: { dark: "#1a3d1a", light: "#2d5a2d" },
    hero: {
      type: "gradient",
      className:
        "bg-gradient-to-br from-[#021a0a] via-[#0a2e14] to-[#051408]",
    },
    heroOverlay:
      "bg-gradient-to-b from-black/50 via-emerald-950/40 to-black/70 backdrop-blur-[2px]",
    heroAccent: "bg-emerald-950/30 mix-blend-multiply",
    heroTitleGradient: "from-green-300 via-emerald-200 to-lime-300",
  },
  mountain: {
    id: "mountain",
    emoji: "⛰️",
    chessBoard: { dark: "#1e293b", light: "#334155" },
    hero: {
      type: "gradient",
      className:
        "bg-gradient-to-br from-[#0a0e18] via-[#1a2236] to-[#2a3148]",
    },
    heroOverlay:
      "bg-gradient-to-b from-black/55 via-slate-900/45 to-black/70 backdrop-blur-[2px]",
    heroAccent: "bg-slate-900/35 mix-blend-multiply",
    heroTitleGradient: "from-slate-300 via-blue-200 to-indigo-300",
  },
};

export function getThemeConfig(theme: ThemeId): ThemeConfig {
  return themeConfigs[theme] ?? themeConfigs.beach;
}
