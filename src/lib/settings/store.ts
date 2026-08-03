import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { Redis } from "@upstash/redis";
import { DEFAULT_LOCALE } from "@/lib/i18n/types";
import { DEFAULT_THEME } from "@/lib/theme/types";
import type {
  SettingsMap,
  StoredUserSettings,
  UserSettings,
  UserSettingsPatch,
} from "./types";

const DATA_DIR = join(process.cwd(), "data");
const SETTINGS_FILE = join(DATA_DIR, "user-settings.json");
const REDIS_KEY = "ankhangfamily:user-settings";

function defaultSettings(): StoredUserSettings {
  return {
    avatarId: null,
    theme: DEFAULT_THEME,
    locale: DEFAULT_LOCALE,
    updatedAt: "",
  };
}

function getRedis(): Redis | null {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return null;
}

declare global {
  // eslint-disable-next-line no-var
  var __ankhangUserSettings: SettingsMap | undefined;
}

function getMemorySettings(): SettingsMap {
  if (!global.__ankhangUserSettings) {
    global.__ankhangUserSettings = {};
  }
  return global.__ankhangUserSettings;
}

function setMemorySettings(settings: SettingsMap) {
  global.__ankhangUserSettings = settings;
}

function readFromFile(): SettingsMap {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  if (!existsSync(SETTINGS_FILE)) {
    writeFileSync(SETTINGS_FILE, JSON.stringify({}, null, 2));
    return {};
  }

  const raw = readFileSync(SETTINGS_FILE, "utf-8");
  return JSON.parse(raw) as SettingsMap;
}

function writeToFile(settings: SettingsMap) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

async function readAllSettings(): Promise<SettingsMap> {
  const redis = getRedis();
  if (redis) {
    const cached = await redis.get<SettingsMap>(REDIS_KEY);
    return cached ?? {};
  }

  if (process.env.VERCEL) {
    return getMemorySettings();
  }

  return readFromFile();
}

async function writeAllSettings(settings: SettingsMap) {
  const redis = getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, settings);
    return;
  }

  if (process.env.VERCEL) {
    setMemorySettings(settings);
    return;
  }

  writeToFile(settings);
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const all = await readAllSettings();
  const stored = all[userId];

  if (!stored) {
    return {
      ...defaultSettings(),
      saved: false,
    };
  }

  return {
    avatarId: stored.avatarId,
    theme: stored.theme,
    locale: stored.locale,
    saved: true,
  };
}

export async function updateUserSettings(
  userId: string,
  patch: UserSettingsPatch
): Promise<UserSettings> {
  const all = await readAllSettings();
  const current = all[userId] ?? defaultSettings();

  all[userId] = {
    avatarId: patch.avatarId !== undefined ? patch.avatarId : current.avatarId,
    theme: patch.theme ?? current.theme,
    locale: patch.locale ?? current.locale,
    updatedAt: new Date().toISOString(),
  };

  await writeAllSettings(all);

  return {
    avatarId: all[userId].avatarId,
    theme: all[userId].theme,
    locale: all[userId].locale,
    saved: true,
  };
}
