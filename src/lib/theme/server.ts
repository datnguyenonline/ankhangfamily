import { cookies } from "next/headers";
import { DEFAULT_THEME, THEME_COOKIE, type ThemeId } from "./types";

export async function getTheme(): Promise<ThemeId> {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE)?.value;
  if (value === "forest" || value === "mountain" || value === "beach") {
    return value;
  }
  return DEFAULT_THEME;
}
