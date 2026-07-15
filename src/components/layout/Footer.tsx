"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

export function Footer({ siteTitle: propSiteTitle }: { siteTitle?: string }) {
  const pathname = usePathname() || "";
  const { 
    siteTitle: contextTitle, 
    siteDescription,
    githubUrl, 
    linkedinUrl, 
    twitterUrl, 
    instagramUrl 
  } = useSiteSettings();
  
  const siteTitle = propSiteTitle || contextTitle;

  // Hide footer on admin routes — admin has its own full-screen layout
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const socialLinks = [
    { href: githubUrl, icon: FaGithub, label: "GitHub" },
    { href: linkedinUrl, icon: FaLinkedin, label: "LinkedIn" },
    { href: twitterUrl, icon: FaTwitter, label: "Twitter" },
    { href: instagramUrl, icon: FaInstagram, label: "Instagram" },
  ].filter(link => !!link.href); // Only render configured socials

  return (
    <footer className="mt-32 border-t border-[var(--border-color)] bg-[var(--secondary-bg)] py-16">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[var(--border-color)]/60">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="text-lg font-bold font-heading text-[var(--text-main)]">{siteTitle}</span>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              {siteDescription || "A personal digital journal and development portfolio documenting learning, project craftsmanship, and progress."}
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">Navigation</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <Link href="/journal" className="hover:text-[var(--primary)] transition-colors">Journal Feed</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[var(--primary)] transition-colors">Projects Portfolio</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[var(--primary)] transition-colors">Media Gallery</Link>
              </li>
              <li>
                <Link href="/learning" className="hover:text-[var(--primary)] transition-colors">Learning Progress</Link>
              </li>
            </ul>
          </div>

          {/* Socials & Community Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">Connect</h4>
            {socialLinks.length > 0 ? (
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Link 
                      key={index}
                      href={social.href} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 hover:scale-105 transition-all shadow-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{social.label}</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">No social links configured.</p>
            )}
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Available for collaborations and technical discussions.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:underline">About Me</Link>
            <span>•</span>
            <Link href="/contact" className="hover:underline">Get In Touch</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
