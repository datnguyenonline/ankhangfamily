export function gradeSlug(grade: number): string {
  return `lop-${grade}`;
}

export function parseGradeSlug(slug: string): number | null {
  const match = slug.match(/^lop-([1-5])$/);
  return match ? Number(match[1]) : null;
}
