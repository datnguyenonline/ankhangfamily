import Link from "next/link";

type BackLinkProps = {
  href: string;
  children: React.ReactNode;
  showIcon?: boolean;
  className?: string;
};

export function BackLink({
  href,
  children,
  showIcon = false,
  className = "",
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`mb-6 inline-flex min-h-11 items-center gap-1.5 py-2 text-sm text-green-500/70 transition-colors hover:text-green-400 active:text-green-300 ${className}`}
    >
      {showIcon && (
        <svg
          className="h-4 w-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      )}
      {children}
    </Link>
  );
}
