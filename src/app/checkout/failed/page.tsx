"use client";

import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutFailedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--background)] py-12 px-6">
      <div className="max-w-md w-full text-center bg-[var(--card)] border border-[var(--border-color)]/80 p-8 rounded-3xl shadow-lg space-y-6 relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Failed Icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500 shadow-inner">
          <XCircle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-[var(--text-main)] tracking-tight">
            Payment Failed
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The transaction was declined by the issuing bank. This can happen due to insufficient funds, incorrect credentials, or temporary bank system delays.
          </p>
        </div>

        {/* Error Info Card */}
        <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl text-left space-y-2 text-xs text-[var(--text-secondary)]">
          <div className="flex justify-between items-center">
            <span>Error Code</span>
            <span className="font-mono font-bold text-red-500 uppercase">DECLINED_BY_BANK</span>
          </div>
          <div className="flex justify-between items-center border-t border-[var(--border-color)]/40 pt-2 mt-2">
            <span>Reference ID</span>
            <span className="font-mono font-semibold text-[var(--text-main)]">ERR-REF-442119</span>
          </div>
        </div>

        {/* Actions buttons */}
        <div className="pt-2 space-y-3">
          <Button className="w-full h-11 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm" asChild>
            <Link href="/checkout">
              <RefreshCw className="w-4 h-4" /> Retry Payment
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-10 rounded-xl border-[var(--border-color)] hover:bg-[var(--secondary-bg)] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer" asChild>
              <Link href="/courses">
                <ArrowLeft className="w-3.5 h-3.5" /> Academy
              </Link>
            </Button>
            <Button variant="outline" className="h-10 rounded-xl border-[var(--border-color)] hover:bg-[var(--secondary-bg)] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer" asChild>
              <Link href="/contact">
                <HelpCircle className="w-3.5 h-3.5" /> Support
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-[10px] text-[var(--text-muted)]">
          No charges were deducted from your card. Contact your bank if the issue persists.
        </p>

      </div>
    </div>
  );
}
