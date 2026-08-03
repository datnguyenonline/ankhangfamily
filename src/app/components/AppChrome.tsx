"use client";

import { SettingsPopupProvider } from "@/lib/settings/popup-context";
import { MobileFooter } from "@/app/components/MobileFooter";
import { SettingsPopup } from "@/app/components/settings/SettingsPopup";

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <SettingsPopupProvider>
      <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </div>
      <MobileFooter />
      <SettingsPopup />
    </SettingsPopupProvider>
  );
}
