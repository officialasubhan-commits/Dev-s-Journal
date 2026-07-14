"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaDiscord, FaLinkedin } from "react-icons/fa";

export function Footer({ siteTitle = "Boss Journal" }: { siteTitle?: string }) {
  const pathname = usePathname() || "";

  // Hide footer on admin routes — admin has its own full-screen layout
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-32 border-t border-[var(--border-color)] bg-[var(--background)] py-16">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[var(--border-color)]/60">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="text-xl font-bold font-heading bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">{siteTitle}</span>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              A personal digital journal and development portfolio documenting learning, project craftsmanship, and progress.
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
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/officialasubhan-commits" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-[var(--secondary-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 hover:scale-105 transition-all shadow-sm"
              >
                <FaGithub className="h-4.5 w-4.5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link 
                href="https://discord.gg/qyCKmTJjR" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-[var(--secondary-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 hover:scale-105 transition-all shadow-sm"
              >
                <FaDiscord className="h-4.5 w-4.5" />
                <span className="sr-only">Discord</span>
              </Link>
              <Link 
                href="https://www.linkedin.com/in/abdus-subhan-57509841a?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-[var(--secondary-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 hover:scale-105 transition-all shadow-sm"
              >
                <FaLinkedin className="h-4.5 w-4.5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
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
