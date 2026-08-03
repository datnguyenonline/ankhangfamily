export type PortalItem = {
  id: string;
  url: string;
};

export type PortalCategory = {
  id: string;
  slug: string;
  icon: string;
  color: string;
  items: PortalItem[];
};

import { routes } from "@/lib/routes";

export const portalCategories: PortalCategory[] = [
  {
    id: "elearning",
    slug: "elearning",
    icon: "📚",
    color: "from-emerald-600/20 to-green-900/10",
    items: [{ id: "on-tap-toan", url: routes.math }],
  },
  {
    id: "games",
    slug: "games",
    icon: "🎮",
    color: "from-lime-600/20 to-emerald-900/10",
    items: [
      { id: "co-vua", url: routes.chess },
      { id: "sudoku", url: routes.sudoku },
    ],
  },
];

export const ITEM_IDS = {
  "on-tap-toan": true,
  "co-vua": true,
  sudoku: true,
} as const;

export function getCategoryBySlug(slug: string): PortalCategory | undefined {
  return portalCategories.find((c) => c.slug === slug);
}
