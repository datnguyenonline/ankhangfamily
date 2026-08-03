import { Header } from "@/app/components/Header";

type MaxWidth = "2xl" | "4xl" | "6xl";
type Glow = "left" | "right" | "none";

const maxWidthClasses: Record<MaxWidth, string> = {
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
};

type PageShellProps = {
  children: React.ReactNode;
  maxWidth?: MaxWidth;
  glow?: Glow;
  mainClassName?: string;
};

export function PageShell({
  children,
  maxWidth = "4xl",
  glow = "none",
  mainClassName = "",
}: PageShellProps) {
  return (
    <div className="relative min-h-screen bg-grid">
      {glow === "left" && (
        <div className="glow-orb -left-32 top-0 h-72 w-72 bg-green-600/10 sm:h-96 sm:w-96" />
      )}
      {glow === "right" && (
        <div className="glow-orb -right-20 top-20 h-56 w-56 bg-green-600/8 sm:h-72 sm:w-72" />
      )}

      <Header />

      <main
        className={`relative mx-auto ${maxWidthClasses[maxWidth]} px-4 py-8 sm:px-6 sm:py-12 ${mainClassName}`}
      >
        {children}
      </main>
    </div>
  );
}
