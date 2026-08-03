import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { Redis } from "@upstash/redis";
import type { UserScore } from "./math/types";

const DATA_DIR = join(process.cwd(), "data");
const SCORES_FILE = join(DATA_DIR, "scores.json");
const REDIS_KEY = "ankhangfamily:scores";

const DEFAULT_SCORES: UserScore[] = [
  {
    userId: "1",
    username: "giaan",
    name: "Gia An",
    totalScore: 0,
    quizzesCompleted: 0,
    lastPlayedAt: "",
  },
  {
    userId: "2",
    username: "dinhkhang",
    name: "Đinh Khang",
    totalScore: 0,
    quizzesCompleted: 0,
    lastPlayedAt: "",
  },
  {
    userId: "3",
    username: "quangia",
    name: "Quản Gia",
    totalScore: 0,
    quizzesCompleted: 0,
    lastPlayedAt: "",
  },
  {
    userId: "4",
    username: "thuydam",
    name: "Thúy Đàm",
    totalScore: 0,
    quizzesCompleted: 0,
    lastPlayedAt: "",
  },
];

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
  var __ankhangScores: UserScore[] | undefined;
}

function getMemoryScores(): UserScore[] {
  if (!global.__ankhangScores) {
    global.__ankhangScores = structuredClone(DEFAULT_SCORES);
  }
  return global.__ankhangScores;
}

function setMemoryScores(scores: UserScore[]) {
  global.__ankhangScores = scores;
}

function readFromFile(): UserScore[] {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  if (!existsSync(SCORES_FILE)) {
    writeFileSync(SCORES_FILE, JSON.stringify(DEFAULT_SCORES, null, 2));
    return DEFAULT_SCORES;
  }

  const raw = readFileSync(SCORES_FILE, "utf-8");
  const scores = JSON.parse(raw) as UserScore[];

  let updated = false;
  for (const def of DEFAULT_SCORES) {
    if (!scores.find((s) => s.userId === def.userId)) {
      scores.push(def);
      updated = true;
    }
  }
  if (updated) writeToFile(scores);
  return scores;
}

function writeToFile(scores: UserScore[]) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
}

async function readScores(): Promise<UserScore[]> {
  const redis = getRedis();
  if (redis) {
    const cached = await redis.get<UserScore[]>(REDIS_KEY);
    if (cached) return cached;
    const initial = structuredClone(DEFAULT_SCORES);
    await redis.set(REDIS_KEY, initial);
    return initial;
  }

  if (process.env.VERCEL) {
    return getMemoryScores();
  }

  return readFromFile();
}

async function writeScores(scores: UserScore[]) {
  const redis = getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, scores);
    return;
  }

  if (process.env.VERCEL) {
    setMemoryScores(scores);
    return;
  }

  writeToFile(scores);
}

export async function getLeaderboard(): Promise<UserScore[]> {
  const scores = await readScores();
  return [...scores].sort((a, b) => b.totalScore - a.totalScore);
}

export async function getUserScore(userId: string): Promise<UserScore | null> {
  const scores = await readScores();
  return scores.find((s) => s.userId === userId) ?? null;
}

export async function addScore(
  userId: string,
  points: number
): Promise<UserScore> {
  const scores = await readScores();
  const idx = scores.findIndex((s) => s.userId === userId);

  if (idx === -1) {
    throw new Error("User not found");
  }

  scores[idx].totalScore += points;
  scores[idx].quizzesCompleted += 1;
  scores[idx].lastPlayedAt = new Date().toISOString();
  await writeScores(scores);
  return scores[idx];
}
