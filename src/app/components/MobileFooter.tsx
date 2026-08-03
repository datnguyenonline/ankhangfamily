"use client";

import { AvatarTrigger } from "@/app/components/AvatarTrigger";

export function MobileFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-green-900/30 bg-theme-deep/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-center px-4">
        <div className="-mt-8">
          <AvatarTrigger
            size="lg"
            className="rounded-full shadow-[0_0_24px_-4px_var(--theme-glow)] ring-4 ring-theme-deep"
          />
        </div>
      </div>
    </footer>
  );
}
