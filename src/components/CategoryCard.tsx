"use client";

import Link from "next/link";
import type { PortalCategory } from "@/lib/data";
import { useTranslation } from "@/lib/i18n/context";

export function CategoryCard({ category }: { category: PortalCategory }) {
  const { t } = useTranslation();

  return (
    <Link
      href={`/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-green-900/40 bg-[#0d120d] p-6 transition-all duration-300 hover:border-green-600/50 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="relative">
        <span className="text-4xl">{category.icon}</span>
        <h3 className="mt-4 font-display text-xl font-bold text-green-50">
          {t(`categories.${category.id}.title`)}
        </h3>
        <p className="mt-1 text-sm text-green-400/70">
          {t(`categories.${category.id}.subtitle`)}
        </p>
        <p className="mt-4 text-xs text-green-500/50">
          {category.items.length} {t("common.products")} · {t("common.tapToView")}
        </p>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-green-400 opacity-0 transition-opacity group-hover:opacity-100">
          {t("common.explore")}
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
