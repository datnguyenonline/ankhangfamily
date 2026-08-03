type DefaultAvatarProps = {
  className?: string;
};

export function DefaultAvatar({ className = "h-full w-full" }: DefaultAvatarProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="12" className="fill-green-900/60" />
      <circle cx="12" cy="9" r="3.5" className="fill-green-300/90" />
      <path
        d="M5.5 18.5c1.4-2.8 3.8-4.2 6.5-4.2s5.1 1.4 6.5 4.2"
        className="stroke-green-300/90"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
