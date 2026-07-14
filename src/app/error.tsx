"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error captured by root boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border-color)] rounded-3xl p-8 md:p-10 shadow-2xl text-center space-y-8 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Error icon */}
        <div className="w-20 h-20 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold font-heading text-[var(--text-main)] tracking-tight">Something went wrong!</h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed font-sans">
            An internal server error occurred. The technical details have been logged. Please try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Button 
            onClick={() => reset()}
            className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 h-11 px-6 rounded-xl font-sans font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </Button>
          <Button asChild variant="outline" className="h-11 px-6 rounded-xl font-sans font-semibold flex items-center justify-center gap-2 cursor-pointer">
            <Link href="/">
              <Home className="w-4 h-4" /> Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
