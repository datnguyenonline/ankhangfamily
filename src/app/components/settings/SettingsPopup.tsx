"use client";

import { useSettingsPopup } from "@/lib/settings/popup-context";
import { ProfilePanel } from "@/app/components/settings/ProfilePanel";

export function SettingsPopup() {
  const { open, setOpen } = useSettingsPopup();

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-black/40 md:bg-black/20"
        aria-hidden
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile"
        className="fixed inset-0 z-[70] flex flex-col md:inset-auto md:right-4 md:top-[calc(3.75rem+env(safe-area-inset-top))] md:max-h-[min(36rem,calc(100vh-5rem))] md:w-[min(22rem,calc(100vw-2rem))] md:shadow-2xl"
      >
        <ProfilePanel onClose={() => setOpen(false)} />
      </div>
    </>
  );
}
