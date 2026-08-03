type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-green-600 to-emerald-500 text-black hover:from-green-500 hover:to-emerald-400 active:scale-[0.98]",
  secondary:
    "border border-green-800/50 bg-green-950/40 text-green-300 hover:border-green-600/50 hover:text-green-200 active:scale-[0.98]",
  ghost:
    "border border-green-800/50 text-green-300 hover:bg-green-950/40 active:scale-[0.98]",
  danger:
    "border border-red-900/50 bg-red-950/40 text-red-300 hover:border-red-600/50 active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 py-2 text-xs sm:text-sm",
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-sm font-semibold sm:text-base",
};

export function buttonClass(
  variant: ButtonVariant = "secondary",
  size: ButtonSize = "md",
  className = ""
) {
  return [
    "inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:opacity-50 disabled:pointer-events-none touch-manipulation",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export const cardClass =
  "rounded-2xl border border-green-900/40 bg-theme-surface transition-all hover:border-green-600/50 hover:shadow-[0_0_40px_-10px_var(--theme-glow)] active:scale-[0.99]";

export const interactiveCardClass =
  "group relative block overflow-hidden rounded-2xl border border-green-900/40 bg-theme-surface p-5 transition-all hover:border-green-600/50 hover:shadow-[0_0_40px_-10px_var(--theme-glow)] active:scale-[0.99] sm:p-6";
