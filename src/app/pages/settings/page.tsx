import { PageShell } from "@/app/components/ui/PageShell";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { ProfilePanel } from "@/app/components/settings/ProfilePanel";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function SettingsPage() {
  const { t } = await getServerTranslation();

  return (
    <PageShell maxWidth="2xl" glow="left">
      <PageHeader
        title={t("settings.title")}
        description={t("settings.subtitle")}
      />

      <ProfilePanel embedded />
    </PageShell>
  );
}
