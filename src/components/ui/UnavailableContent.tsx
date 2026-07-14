import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UnavailableContent({ type = "content" }: { type?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border-color)] rounded-2xl p-8 shadow-xl text-center space-y-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="w-16 h-16 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight font-heading text-[var(--text-main)]">Content Unavailable</h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This {type.toLowerCase()} is currently unavailable. The link may be broken, or the content has been moved or removed by the author.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Button variant="outline" asChild className="flex items-center gap-2 font-sans font-medium h-11 rounded-lg">
            <Link href="/">
              <Home className="w-4 h-4" /> Go Home
            </Link>
          </Button>
          <Button variant="default" asChild className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 flex items-center gap-2 font-sans font-medium h-11 rounded-lg">
            <Link href={type.toLowerCase() === "project" ? "/projects" : "/journal"}>
              Browse {type.toLowerCase() === "project" ? "Projects" : "Journal"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
