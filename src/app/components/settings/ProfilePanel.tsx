"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarDisplay } from "@/app/components/AvatarDisplay";
import { AvatarPicker } from "@/app/components/AvatarPicker";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import { SettingsDetailModal } from "@/app/components/settings/SettingsDetailModal";
import { Button } from "@/app/components/ui/Button";
import { useAvatar } from "@/lib/avatar/context";
import { useTranslation } from "@/lib/i18n/context";
import { routes } from "@/lib/routes";
import { useSettingsPopup } from "@/lib/settings/popup-context";

function SettingsInlineRow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-green-900/30 px-4 py-4 last:border-b-0">
      <p className="mb-3 font-medium text-green-50">{title}</p>
      {children}
    </div>
  );
}

function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("login.error"));
      return;
    }

    router.refresh();
    onSuccess();
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoComplete="username"
        placeholder={t("login.usernamePlaceholder")}
        className="w-full rounded-lg border border-green-900/50 bg-theme-deep px-4 py-3 text-green-50 placeholder:text-green-800 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        placeholder="••••••"
        className="w-full rounded-lg border border-green-900/50 bg-theme-deep px-4 py-3 text-green-50 placeholder:text-green-800 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30"
      />
      {error && (
        <p className="rounded-lg bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
        {loading ? t("login.submitting") : t("nav.login")}
      </Button>
      <Button href={routes.login} variant="ghost" size="md" className="w-full">
        {t("settings.fullLoginPage")}
      </Button>
    </form>
  );
}

type ProfilePanelProps = {
  onClose?: () => void;
  embedded?: boolean;
};

export function ProfilePanel({ onClose, embedded = false }: ProfilePanelProps) {
  const { avatarId, setAvatarId } = useAvatar();
  const { data: session } = useSession();
  const { t } = useTranslation();
  const { setOpen } = useSettingsPopup();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    if (!embedded && onClose) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [embedded, onClose]);

  function handleClose() {
    if (onClose) onClose();
    else setOpen(false);
  }

  function handleSignOut() {
    signOut({ callbackUrl: routes.home });
    handleClose();
  }

  const shellClass = embedded
    ? "overflow-hidden rounded-2xl border border-green-900/40 bg-theme-surface"
    : "flex h-full min-h-0 flex-col overflow-hidden bg-theme-deep md:rounded-2xl md:border md:border-green-900/40";

  return (
    <>
      <div className={shellClass}>
        <div className="relative shrink-0 bg-gradient-to-b from-green-900/50 via-green-950/30 to-theme-deep px-4 pb-5 pt-[max(0.75rem,env(safe-area-inset-top))] text-center md:rounded-t-2xl md:pt-4">
          {onClose && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] flex min-h-10 min-w-10 items-center justify-center rounded-full bg-black/20 text-green-100 hover:bg-black/30 md:top-3"
              aria-label={t("settings.close")}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAvatarPicker((current) => !current)}
            className="mx-auto flex flex-col items-center gap-2 rounded-2xl p-2 transition-colors hover:bg-white/5 active:bg-white/10"
            aria-expanded={showAvatarPicker}
            aria-label={t("settings.changeAvatar")}
          >
            <AvatarDisplay
              avatarId={avatarId}
              size="hero"
              ring
              className="ring-offset-green-950/80"
            />
            <span className="text-sm font-medium text-green-300">
              {showAvatarPicker ? t("settings.hideAvatars") : t("settings.changeAvatar")}
            </span>
          </button>

          {session?.user ? (
            <p className="mt-2 font-display text-xl font-semibold text-green-50">
              {session.user.name}
            </p>
          ) : (
            <p className="mt-2 text-sm text-green-400/70">{t("settings.guest")}</p>
          )}

          {showAvatarPicker && (
            <div className="mt-4 rounded-2xl border border-green-900/30 bg-theme-surface/80 p-3 backdrop-blur-sm">
              <AvatarPicker value={avatarId} onChange={setAvatarId} />
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-theme-surface md:bg-theme-deep">
          <SettingsInlineRow title={t("theme.label")}>
            <ThemeSwitcher />
          </SettingsInlineRow>

          <SettingsInlineRow title={t("settings.languageTitle")}>
            <LanguageSwitcher />
          </SettingsInlineRow>

          <div className="px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {session?.user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="flex min-h-12 w-full items-center justify-center rounded-xl border border-red-900/40 bg-red-950/20 font-medium text-red-400 transition-colors hover:bg-red-950/35 active:bg-red-950/45"
              >
                {t("nav.logout")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowSignIn(true)}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 font-semibold text-black transition-all hover:from-green-500 hover:to-emerald-400"
              >
                {t("nav.login")}
              </button>
            )}
          </div>
        </div>
      </div>

      <SettingsDetailModal
        title={t("nav.login")}
        open={showSignIn}
        onBack={() => setShowSignIn(false)}
      >
        <SignInForm onSuccess={() => setShowSignIn(false)} />
      </SettingsDetailModal>
    </>
  );
}

// Keep export alias for settings page
export const SettingsPopupContent = ProfilePanel;
