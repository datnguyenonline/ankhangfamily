import type { PortalItem } from "@/lib/data";

export function ResourceCard({ item }: { item: PortalItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-green-900/30 bg-[#0d120d] p-5 transition-all hover:border-green-600/40 hover:bg-[#111811] hover:shadow-[0_0_30px_-10px_rgba(34,197,94,0.2)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-green-50 group-hover:text-green-400">
          {item.title}
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
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-green-300/60">
        {item.description}
      </p>
      {item.tags && item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-green-950/80 px-2.5 py-0.5 text-[11px] font-medium text-green-500/80 ring-1 ring-green-800/40"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
