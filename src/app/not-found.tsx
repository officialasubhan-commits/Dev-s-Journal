import Link from "next/link";
import { Home, Briefcase, FileText, Mail, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border-color)] rounded-3xl p-8 md:p-10 shadow-2xl text-center space-y-8 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Illustration */}
        <div className="w-20 h-20 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto shadow-inner relative">
          <HelpCircle className="w-10 h-10" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--primary)]"></span>
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold font-heading text-[var(--text-main)] tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-[var(--text-main)] font-heading">Page Not Found</h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed font-sans">
            The page you are looking for doesn't exist, was moved, or has been temporarily taken offline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button asChild variant="default" className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 h-11 rounded-xl font-sans font-semibold flex items-center justify-center gap-2 cursor-pointer">
            <Link href="/">
              <Home className="w-4 h-4" /> Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl font-sans font-semibold flex items-center justify-center gap-2 cursor-pointer">
            <Link href="/projects">
              <Briefcase className="w-4 h-4" /> Projects
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl font-sans font-semibold flex items-center justify-center gap-2 cursor-pointer">
            <Link href="/journal">
              <FileText className="w-4 h-4" /> Journal
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl font-sans font-semibold flex items-center justify-center gap-2 cursor-pointer">
            <Link href="/contact">
              <Mail className="w-4 h-4" /> Contact
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
