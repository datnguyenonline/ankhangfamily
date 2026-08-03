"use client";

import Link from "next/link";
import type { PortalItem } from "@/lib/data";
import { useTranslation } from "@/lib/i18n/context";

export function ResourceCard({ item }: { item: PortalItem }) {
  const { dictionary } = useTranslation();
  const itemData = dictionary.items[item.id as keyof typeof dictionary.items];
  const title = itemData?.title ?? item.id;
  const description = itemData?.description ?? "";
  const tagList = itemData?.tags ?? [];

  return (
    <Link
      href={item.url}
      className="group flex flex-col rounded-xl border border-green-900/30 bg-theme-surface p-5 transition-all hover:border-green-600/40 hover:bg-theme-elevated hover:shadow-[0_0_30px_-10px_var(--theme-glow)] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-green-50 group-hover:text-green-400">
          {title}
        </h3>
        <svg
          className="h-4 w-4 shrink-0 text-green-600/50 transition-colors group-hover:text-green-400"
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
      <p className="mt-2 flex-1 text-sm leading-relaxed text-green-300/60">
        {description}
      </p>
      {tagList.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tagList.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-green-950/80 px-2.5 py-0.5 text-[11px] font-medium text-green-500/80 ring-1 ring-green-800/40"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
