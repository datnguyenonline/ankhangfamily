"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";

type SettingsDetailModalProps = {
  title: string;
  open: boolean;
  onBack: () => void;
  children: React.ReactNode;
  size?: "default" | "lg";
};

export function SettingsDetailModal({
  title,
  open,
  onBack,
  children,
  size = "default",
}: SettingsDetailModalProps) {
  const { t } = useTranslation();
  const isLarge = size === "lg";

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const panelClass = isLarge
    ? "fixed inset-0 z-[90] flex flex-col bg-theme-deep md:inset-auto md:left-1/2 md:top-1/2 md:w-[min(32rem,calc(100vw-2rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:overflow-hidden md:rounded-2xl md:border md:border-green-900/40 md:shadow-2xl"
    : "fixed inset-0 z-[90] flex flex-col bg-theme-deep md:inset-4 md:left-1/2 md:top-1/2 md:max-h-[min(85vh,640px)] md:w-[min(24rem,calc(100vw-2rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:overflow-hidden md:rounded-2xl md:border md:border-green-900/40 md:shadow-2xl";

  const bodyClass = isLarge
    ? "flex flex-1 flex-col justify-center px-6 py-8 md:px-8 md:py-10"
    : "min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))]";

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
        aria-label={t("settings.close")}
        onClick={onBack}
      />

      <div
        className={panelClass}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-green-900/30 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:pt-3">
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-green-400 hover:bg-green-950/50 hover:text-green-200"
            aria-label={t("settings.back")}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h3 className="min-w-0 flex-1 truncate font-display text-xl font-semibold text-green-50">
            {title}
          </h3>
        </div>

        <div className={bodyClass}>{children}</div>
      </div>
    </>
  );
}
