import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PageTracker } from "@/components/ui/PageTracker";
import { RealtimeSyncProvider } from "@/components/providers/RealtimeSyncProvider";
import { SiteSettingsProvider } from "@/components/providers/SiteSettingsProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

import { getSiteSettings } from "@/app/admin/settings/actions";

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

  const settingsPayload = {
    siteTitle: settings?.siteTitle || "Boss Journal",
    siteTagline: settings?.siteTagline || "My personal portfolio, journal, and digital headquarters.",
    siteDescription: settings?.siteDescription || "My personal portfolio, journal, and digital headquarters.",
    siteLogo: settings?.siteLogo || "",
    siteFavicon: settings?.siteFavicon || "",
    siteUrl: settings?.siteUrl || "http://localhost:3000",
    authorName: settings?.authorName || "Abdus Subhan",
    authorEmail: settings?.authorEmail || "",
    contactEmail: settings?.contactEmail || "",
    availabilityStatus: settings?.availabilityStatus || "Available",
    contactHeading: settings?.contactHeading || "Get In Touch",
    contactDescription: settings?.contactDescription || "Have a project in mind, want to collaborate, or just want to say hi? Send me a message!",
    githubUrl: settings?.githubUrl || "",
    linkedinUrl: settings?.linkedinUrl || "",
    twitterUrl: settings?.twitterUrl || "",
    instagramUrl: settings?.instagramUrl || "",
    youtubeUrl: settings?.youtubeUrl || "",
    discordUsername: settings?.discordUsername || "",
    telegramUsername: settings?.telegramUsername || "",
    enableComments: settings?.enableComments ?? true,
    enableGallery: settings?.enableGallery ?? true,
    enableLearning: settings?.enableLearning ?? true,
    enableNotifications: settings?.enableNotifications ?? true,
    
    // Homepage Customization
    heroTitle: settings?.heroTitle || "Designing simple, warm & premium digital experiences.",
    heroHighlighted: settings?.heroHighlighted || "warm & premium",
    heroDescription: settings?.heroDescription || "I am a Software Engineer and UI/UX Designer. This is my digital space where I log my daily learnings, showcase craft projects, and write summaries.",
    heroProfileImage: settings?.heroProfileImage || "",
    heroBgDecor: settings?.heroBgDecor || "glow",
    heroBtnPrimaryText: settings?.heroBtnPrimaryText || "Explore Projects",
    heroBtnPrimaryLink: settings?.heroBtnPrimaryLink || "/projects",
    heroBtnSecondaryText: settings?.heroBtnSecondaryText || "Read Journal",
    heroBtnSecondaryLink: settings?.heroBtnSecondaryLink || "/journal",
    authorTitle: settings?.authorTitle || "Software Engineer & UI/UX Designer",
    authorBio: settings?.authorBio || "Based in India. Focuses on Next.js 16, React 19, TypeScript, and modern clean interface details.",
    featuredProjects: settings?.featuredProjects || [],
    featuredPosts: settings?.featuredPosts || [],
    featuredCertificates: settings?.featuredCertificates || [],
    featuredCourses: settings?.featuredCourses || [],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-[var(--text-main)]`}>
        <ThemeProvider attribute="data-theme" defaultTheme={settings?.defaultTheme || "light"} enableSystem>
          <AuthProvider>
            <RealtimeSyncProvider>
              <SiteSettingsProvider value={settingsPayload}>
                <PageTracker />
                {/* 
                  Navbar and Footer are "use client" components.
                  They check usePathname() internally and return null on /admin/* routes.
                  This prevents them from interfering with the admin panel's own full-screen layout.
                */}
                <Navbar siteTitle={settingsPayload.siteTitle} siteLogo={settingsPayload.siteLogo} />
                {children}
                <Footer siteTitle={settingsPayload.siteTitle} />
              </SiteSettingsProvider>
            </RealtimeSyncProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
