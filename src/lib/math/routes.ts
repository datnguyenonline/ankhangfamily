export function gradeSlug(grade: number): string {
  return `grade-${grade}`;
}

export function parseGradeSlug(slug: string): number | null {
  const match = slug.match(/^grade-([1-5])$/);
  return match ? Number(match[1]) : null;
}

export function legacyGradeSlug(grade: number): string {
  return `lop-${grade}`;
}
