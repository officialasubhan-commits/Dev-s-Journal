"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function CheckoutPendingPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate redirection delay from bank webhook confirmations
    const timer = setTimeout(() => {
      router.push("/checkout/success");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--background)] py-12 px-6">
      <div className="max-w-md w-full text-center bg-[var(--card)] border border-[var(--border-color)]/80 p-8 rounded-3xl shadow-lg space-y-6 relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Loading Spinner */}
        <div className="w-16 h-16 rounded-full bg-[var(--secondary-bg)] border border-[var(--border-color)]/70 flex items-center justify-center mx-auto shadow-inner text-[var(--primary)]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-[var(--text-main)] tracking-tight">
            Processing Payment
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            We are confirming your payment authorization with your banking institution. Please do not refresh this page or click back.
          </p>
        </div>

        {/* Info Alerts */}
        <div className="p-4 bg-[var(--secondary-bg)]/40 border border-[var(--border-color)]/60 rounded-2xl space-y-3 text-xs text-[var(--text-secondary)] text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
            <span className="font-semibold text-[var(--text-main)]">Verifying secure SSL payload</span>
          </div>
          <div className="flex items-center gap-2 border-t border-[var(--border-color)]/30 pt-2 mt-2">
            <AlertCircle className="w-4 h-4 text-[var(--secondary)]" />
            <span>Redirecting automatically when completed...</span>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-[10px] text-[var(--text-muted)] animate-pulse font-medium">
            Waiting for bank notification webhook triggers...
          </p>
        </div>

      </div>
    </div>
  );
}
