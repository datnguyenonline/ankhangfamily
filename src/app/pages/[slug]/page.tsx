import { notFound } from "next/navigation";
import { PageShell } from "@/app/components/ui/PageShell";
import { BackLink } from "@/app/components/ui/BackLink";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { ResourceCard } from "@/app/components/ResourceCard";
import { getCategoryBySlug, portalCategories } from "@/lib/data";
import { routes } from "@/lib/routes";
import { getServerTranslation } from "@/lib/i18n/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return portalCategories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const { t } = await getServerTranslation();

  if (!category) {
    notFound();
  }

  return (
    <PageShell maxWidth="6xl" glow="right" mainClassName="py-10 sm:py-14">
      <BackLink href={routes.home} showIcon>
        {t("common.backHome")}
      </BackLink>

      <PageHeader
        icon={category.icon}
        title={t(`categories.${category.id}.title`)}
        description={t(`categories.${category.id}.subtitle`)}
      />

      <div className="grid grid-cols-2 gap-4">
        {category.items.map((item) => (
          <ResourceCard key={item.id} item={item} />
        ))}
      </div>
    </PageShell>
  );
}
