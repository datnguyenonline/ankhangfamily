"use client";

type Option<T extends string> = {
  value: T;
  label: React.ReactNode;
  ariaLabel?: string;
};

type SegmentedControlProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  transparent?: boolean;
  groupLabel?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  transparent = false,
  groupLabel,
}: SegmentedControlProps<T>) {
  const containerClass = transparent
    ? "border-white/20 bg-white/10"
    : "border-green-800/50 bg-green-950/40";

  const activeClass = transparent
    ? "bg-white text-black"
    : "bg-green-600 text-black";

  const inactiveClass = transparent
    ? "text-white/70 hover:text-white active:text-white"
    : "text-green-400/70 hover:text-green-300 active:text-green-200";

  return (
    <div
      className={`flex rounded-lg border p-0.5 ${containerClass}`}
      role="group"
      aria-label={groupLabel}
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-h-9 min-w-9 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors touch-manipulation sm:min-h-10 sm:px-3 ${
              active ? activeClass : inactiveClass
            }`}
            aria-label={option.ariaLabel ?? String(option.label)}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
