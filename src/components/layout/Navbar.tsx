"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion } from "framer-motion";
import { Menu, X, Home, BookHeart, Briefcase, Camera, GraduationCap, User, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

const navLinks = [
  { href: "/journal", label: "Journal", icon: BookHeart },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/certifications", label: "Certificates", icon: ShieldCheck },
  { href: "/gallery", label: "Gallery", icon: Camera },
  { href: "/about", label: "About", icon: User },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Navbar({ siteTitle: propSiteTitle, siteLogo: propSiteLogo }: { siteTitle?: string; siteLogo?: string }) {
  const { siteTitle: contextTitle, siteLogo: contextLogo } = useSiteSettings();
  const siteTitle = propSiteTitle || contextTitle || "Boss Journal";
  const siteLogo = propSiteLogo || contextLogo;

  const { data: session, status } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide navbar on admin routes — admin has its own sidebar layout
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>

      <header className="sticky top-0 z-50 w-full flex justify-center pt-4 pb-2 px-4 transition-all duration-300">
        <div className="w-full max-w-5xl glass border border-[var(--border-color)]/30 rounded-full h-14 flex items-center justify-between px-4 md:px-6 shadow-sm">
          
          {/* Logo */}
          <div className="flex-1 flex justify-start shrink-0">
            <Link href="/" className="flex items-center space-x-2 relative group">
              {siteLogo ? (
                <Image 
                  src={siteLogo} 
                  alt={siteTitle} 
                  width={30}
                  height={30}
                  className="rounded-full object-cover border border-[var(--border-color)] flex-shrink-0" 
                />
              ) : null}
              <span className="text-base font-bold font-heading text-[var(--text-main)] transition-all group-hover:text-[var(--primary)]">
                {siteTitle}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 relative shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors"
                >
                  <span className={`relative z-10 ${isActive ? "text-[var(--primary)] font-semibold" : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"}`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-[var(--primary)]/10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex-1 flex justify-end items-center gap-2 shrink-0">
            {status === "authenticated" && isAdmin ? (
              <NotificationDropdown />
            ) : (
              <NotificationDropdown isPublicMode={true} />
            )}
            <ThemeToggle />

            {status === "authenticated" && isAdmin ? (
              <>
                <Link href="/admin/dashboard" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors px-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
                <Button variant="outline" size="sm" className="rounded-full h-9 hidden sm:flex" onClick={() => signOut()}>Logout</Button>
              </>
            ) : null}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--background)] border border-[var(--border-color)] transition-all"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-[72px] left-4 right-4 bg-[var(--card)] border border-[var(--border-color)] rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${isActive ? "text-[var(--primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--background)]"}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
            <div className="border-t border-[var(--border-color)] my-2" />
            {status === "authenticated" && isAdmin ? (
              <>
                <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-[var(--accent)]">
                  <ShieldCheck className="w-4 h-4" /> Admin Panel
                </Link>
                <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-[var(--error)] hover:bg-[var(--error)]/5">
                  Logout
                </button>
              </>
            ) : null}
          </div>
        )}
      </header>
    </>
  );
}
