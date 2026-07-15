"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutSuccessPage() {
  const [copied, setCopied] = useState(false);
  const orderId = "ORD-2026-99382";

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--background)] py-12 px-6">
      <div className="max-w-md w-full text-center bg-[var(--card)] border border-[var(--border-color)]/80 p-8 rounded-3xl shadow-lg space-y-6 relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-500 shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-[var(--text-main)] tracking-tight">
            Purchase Successful!
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Thank you for enrolling! Your payment has been authorized, and the course has been instantly added to your dashboard.
          </p>
        </div>

        {/* Order Details Panel */}
        <div className="bg-[var(--secondary-bg)]/40 border border-[var(--border-color)]/50 p-4 rounded-2xl text-left space-y-2 text-xs">
          <div className="flex justify-between items-center text-[var(--text-secondary)]">
            <span>Transaction ID</span>
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-[var(--text-main)]">{orderId}</span>
              <button 
                onClick={handleCopy}
                className="p-1 rounded hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors"
                title="Copy Transaction ID"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
          {copied && (
            <p className="text-[10px] text-right text-green-600 font-semibold animate-pulse">Copied to clipboard!</p>
          )}
          <div className="flex justify-between items-center text-[var(--text-secondary)] border-t border-[var(--border-color)]/40 pt-2 mt-2">
            <span>Access Status</span>
            <span className="font-semibold text-green-600">Active / Lifetime Access</span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="pt-2 space-y-3">
          <Button className="w-full h-11 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm" asChild>
            <Link href="/student/dashboard">
              Go To Student Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          
          <Button variant="outline" className="w-full h-11 rounded-xl border-[var(--border-color)] hover:bg-[var(--secondary-bg)] font-semibold flex items-center justify-center gap-2 cursor-pointer" onClick={() => window.print()}>
            <FileText className="w-4 h-4" /> Print PDF Receipt
          </Button>
        </div>

        <p className="text-[10px] text-[var(--text-muted)]">
          A receipt and registration confirmation has been sent to your email.
        </p>

      </div>
    </div>
  );
}
