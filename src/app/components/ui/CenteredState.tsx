import { Header } from "@/app/components/Header";
import { Button } from "./Button";

type CenteredStateProps = {
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  tone?: "default" | "error";
  withHeader?: boolean;
};

export function CenteredState({
  message,
  actionLabel,
  actionHref,
  onAction,
  tone = "default",
  withHeader = false,
}: CenteredStateProps) {
  const messageClass =
    tone === "error" ? "text-red-400" : "text-green-400/80";

  return (
    <div className="flex min-h-screen flex-col bg-theme-deep">
      {withHeader && <Header />}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12">
        <p className={`text-center text-sm sm:text-base ${messageClass}`}>
          {message}
        </p>
        {actionLabel &&
          (actionHref ? (
            <Button href={actionHref} variant="primary" size="md">
              {actionLabel}
            </Button>
          ) : onAction ? (
            <Button variant="primary" size="md" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null)}
      </div>
    </div>
  );
}
