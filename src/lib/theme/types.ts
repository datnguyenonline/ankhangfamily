export type ThemeId = "beach" | "forest" | "mountain";

export const DEFAULT_THEME: ThemeId = "beach";
export const THEMES: ThemeId[] = ["beach", "forest", "mountain"];
export const THEME_COOKIE = "theme";

export type ThemeConfig = {
  id: ThemeId;
  emoji: string;
  chessBoard: { dark: string; light: string };
  hero:
    | { type: "image"; src: string }
    | { type: "gradient"; className: string };
  heroOverlay: string;
  heroAccent: string;
  heroTitleGradient: string;
};
