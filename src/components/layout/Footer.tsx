"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export function Footer({ siteTitle = "Boss Journal" }: { siteTitle?: string }) {
  const pathname = usePathname();

  // Hide footer on admin routes — admin has its own full-screen layout
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-20 border-t border-[var(--border-color)] bg-[var(--secondary-bg)] py-12">
      <div className="container max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-lg font-bold font-heading text-[var(--text-main)]">{siteTitle}</span>
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-6">
          <Link href="https://github.com" target="_blank" rel="noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all hover:scale-110">
            <FaGithub className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all hover:scale-110">
            <FaTwitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all hover:scale-110">
            <FaLinkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
