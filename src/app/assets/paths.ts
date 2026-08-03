import { join } from "path";

const ASSETS_DIR = join(process.cwd(), "src/app/assets");

export function mathQuestionsPath(grade: number): string {
  return join(ASSETS_DIR, "data", "math", `grade-${grade}.json`);
}
