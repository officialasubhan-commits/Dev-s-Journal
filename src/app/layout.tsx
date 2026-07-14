import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PageTracker } from "@/components/ui/PageTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

import prisma from "@/lib/prisma";

async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
  } catch (error) {
    console.log("[v0] Failed to load site settings, using defaults:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      template: `%s | ${settings?.siteTitle || "Boss Journal"}`,
      default: settings?.seoTitle || settings?.siteTitle || "Boss Journal | Portfolio & Digital Home",
    },
    description: settings?.seoDescription || settings?.siteDescription || "My digital home, where I document my journey, learning, projects, and daily life.",
    keywords: settings?.seoKeywords || undefined,
    openGraph: settings?.ogImage ? {
      images: [settings.ogImage]
    } : undefined,
    icons: settings?.siteFavicon ? {
      icon: settings.siteFavicon
    } : undefined
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {settings?.googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.googleAnalyticsId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-[var(--text-main)]`}>
        <ThemeProvider attribute="data-theme" defaultTheme={settings?.defaultTheme || "light"} enableSystem>
          <AuthProvider>
            <PageTracker />
            {/* 
              Navbar and Footer are "use client" components.
              They check usePathname() internally and return null on /admin/* routes.
              This prevents them from interfering with the admin panel's own full-screen layout.
            */}
            <Navbar siteTitle={settings?.siteTitle || "Boss Journal"} siteLogo={settings?.siteLogo || ""} />
            {children}
            <Footer siteTitle={settings?.siteTitle || "Boss Journal"} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
