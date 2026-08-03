import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/app/components/Providers";
import { getServerTranslation } from "@/lib/i18n/server";
import { getTheme } from "@/lib/theme/server";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { dictionary } = await getServerTranslation();
  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ locale }, theme] = await Promise.all([
    getServerTranslation(),
    getTheme(),
  ]);

  return (
    <html
      lang={locale}
      data-theme={theme}
      className={`${syne.variable} ${jakarta.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <Providers locale={locale} theme={theme}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
