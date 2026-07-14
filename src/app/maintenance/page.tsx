import prisma from "@/lib/prisma";
import { ShieldAlert } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let siteTitle = "Boss Journal";
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
      select: { siteTitle: true },
    });
    if (settings?.siteTitle) {
      siteTitle = settings.siteTitle;
    }
  } catch (error) {
    console.error("Failed to load settings for metadata:", error);
  }

  return {
    title: `Under Maintenance | ${siteTitle}`,
    description: "Our website is currently undergoing scheduled maintenance. We'll be back shortly.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function MaintenancePage() {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
  } catch (error) {
    console.error("Failed to load site settings on maintenance page:", error);
  }

  const siteTitle = settings?.siteTitle || "Boss Journal";
  const siteLogo = settings?.siteLogo || "";
  const maintenanceMessage = settings?.maintenanceMessage || "We'll be back soon!";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-red-500/5 dark:to-red-950/5 relative overflow-hidden">
      {/* Background Micro-animations */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-red-400/20 dark:bg-red-900/10 rounded-full blur-3xl animate-pulse duration-[6s]" />
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl animate-pulse duration-[8s]" />
      </div>

      <div className="max-w-md w-full text-center space-y-8 p-8 rounded-2xl bg-[var(--background)]/80 dark:bg-[var(--background)]/75 border border-[var(--border-color)] shadow-2xl backdrop-blur-xl z-10 transition-all duration-300">
        
        {/* Website Logo/Icon */}
        <div className="flex justify-center">
          {siteLogo ? (
            <img 
              src={siteLogo} 
              alt={`${siteTitle} Logo`} 
              className="h-16 w-auto object-contain rounded-lg shadow-sm border border-[var(--border-color)]/50 p-1" 
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400 shadow-md">
              <ShieldAlert className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Website Name */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-widest text-[var(--text-secondary)] uppercase">
            {siteTitle}
          </h2>
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-[var(--text-main)] tracking-tight">
            We'll be back soon!
          </h1>
        </div>

        {/* Custom Maintenance Message */}
        <div className="relative p-5 rounded-xl bg-red-50/30 border border-red-100/50 dark:bg-red-950/5 dark:border-red-900/10 text-left">
          <span className="absolute -top-3 left-4 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-red-700 bg-red-100 border border-red-200 rounded-full dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/30">
            SYSTEM NOTICE
          </span>
          <p className="text-sm md:text-base text-red-800 dark:text-red-300 font-medium leading-relaxed mt-1 break-words">
            {maintenanceMessage}
          </p>
        </div>

        {/* Friendly Description */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          We are currently updating our systems to improve your experience. Visitor access is temporarily paused, but we will return shortly. Thank you for your patience!
        </p>

        {/* Premium Loading Animation */}
        <div className="flex items-center justify-center gap-2.5 py-4">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="mt-8 text-xs text-[var(--text-muted)] z-10">
        &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.
      </footer>
    </div>
  );
}
