import type { UserSettings, UserSettingsPatch } from "./types";

export async function fetchUserSettings(): Promise<UserSettings | null> {
  try {
    const res = await fetch("/api/settings");
    if (!res.ok) return null;
    return (await res.json()) as UserSettings;
  } catch {
    return null;
  }
}

export async function saveUserSettings(patch: UserSettingsPatch): Promise<boolean> {
  try {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    return res.ok;
  } catch {
    return false;
  }
}
