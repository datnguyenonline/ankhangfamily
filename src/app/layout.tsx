import type { Metadata, Viewport } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/app/components/Providers";
import { AppChrome } from "@/app/components/AppChrome";
import { getServerTranslation } from "@/lib/i18n/server";
import { getTheme } from "@/lib/theme/server";
import { THEME_BG } from "@/lib/theme/types";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export async function generateViewport(): Promise<Viewport> {
  const theme = await getTheme();
  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: THEME_BG[theme],
    colorScheme: "dark",
  };
}

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
  const themeBg = THEME_BG[theme];

  return (
    <html
      lang={locale}
      data-theme={theme}
      className={`${syne.variable} ${jakarta.variable} h-full`}
      style={{ backgroundColor: themeBg }}
    >
      <body
        className="min-h-full antialiased"
        style={{ backgroundColor: themeBg, color: "#f0fdfa" }}
      >
        <Providers locale={locale} theme={theme}>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
