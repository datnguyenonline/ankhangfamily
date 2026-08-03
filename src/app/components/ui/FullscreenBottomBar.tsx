"use client";

import { Button } from "./Button";
import { useTranslation } from "@/lib/i18n/context";

type FullscreenBottomBarProps = {
  onExitFullscreen: () => void;
  onExitGame: () => void;
};

export function FullscreenBottomBar({
  onExitFullscreen,
  onExitGame,
}: FullscreenBottomBarProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center justify-center gap-2 border-t border-green-900/50 bg-theme-deep/95 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:gap-3 sm:px-4">
      <Button variant="secondary" size="md" onClick={onExitFullscreen}>
        {t("common.exitFullscreen")}
      </Button>
      <Button variant="danger" size="md" onClick={onExitGame}>
        {t("common.exitGame")}
      </Button>
    </div>
  );
}
