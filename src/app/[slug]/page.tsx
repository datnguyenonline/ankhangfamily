import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { ResourceCard } from "@/components/ResourceCard";
import { getCategoryBySlug } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [
    { slug: "elearning" },
    { slug: "games" },
    { slug: "reading" },
    { slug: "videos" },
    { slug: "creativity" },
  ];
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-grid">
      <div className="glow-orb -right-20 top-20 h-72 w-72 bg-green-600/8" />

      <Header />

      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-green-500/70 transition-colors hover:text-green-400"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Về trang chủ
        </Link>

        <div className="mb-10 flex items-start gap-4">
          <span className="text-5xl">{category.icon}</span>
          <div>
            <h1 className="font-display text-3xl font-bold text-green-50 sm:text-4xl">
              {category.title}
            </h1>
            <p className="mt-1 text-green-400/70">{category.subtitle}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {category.items.map((item) => (
            <ResourceCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
