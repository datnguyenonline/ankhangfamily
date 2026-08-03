"use client";

import { Button } from "./Button";
import { useTranslation } from "@/lib/i18n/context";

type GameResultPanelProps = {
  title: string;
  points?: number | null;
  scoreMessage: string;
  onPlayAgain: () => void;
  onChooseLevel: () => void;
};

export function GameResultPanel({
  title,
  points,
  scoreMessage,
  onPlayAgain,
  onChooseLevel,
}: GameResultPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md rounded-xl border border-green-800/40 bg-theme-surface p-4 text-center sm:p-5">
      <p className="font-display text-xl font-bold text-green-50 sm:text-2xl">
        {title}
      </p>
      {points !== null && points !== undefined && (
        <p className="mt-2 text-green-400">
          +{points} {t("common.points")}
        </p>
      )}
      <p className="mt-1 text-sm text-green-300/60">{scoreMessage}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button variant="primary" size="md" className="w-full sm:w-auto" onClick={onPlayAgain}>
          {t("common.playAgain")}
        </Button>
        <Button variant="ghost" size="md" className="w-full sm:w-auto" onClick={onChooseLevel}>
          {t("common.chooseOtherLevel")}
        </Button>
      </div>
    </div>
  );
}
