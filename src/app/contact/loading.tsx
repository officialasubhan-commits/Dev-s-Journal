import React from "react";

export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl animate-pulse">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center md:text-left flex flex-col md:items-start items-center">
          <div className="h-6 w-32 bg-[var(--secondary-bg)] rounded-full" />
          <div className="h-10 md:h-12 w-64 bg-[var(--card)] rounded-xl" />
          <div className="h-4 w-96 bg-[var(--secondary-bg)]/80 rounded" />
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Form placeholder */}
          <div className="md:col-span-3 bg-[var(--card)] border border-[var(--border-color)]/70 p-6 md:p-8 rounded-3xl space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-[var(--secondary-bg)]/80 rounded" />
              <div className="h-10 w-full bg-[var(--background)] border border-[var(--border-color)]/60 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-[var(--secondary-bg)]/80 rounded" />
              <div className="h-10 w-full bg-[var(--background)] border border-[var(--border-color)]/60 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-[var(--secondary-bg)]/80 rounded" />
              <div className="h-28 w-full bg-[var(--background)] border border-[var(--border-color)]/60 rounded-2xl" />
            </div>
            <div className="h-11 w-32 bg-[var(--secondary-bg)]/90 rounded-xl pt-2" />
          </div>

          {/* Info panel placeholder */}
          <div className="md:col-span-2 space-y-6 bg-[var(--secondary-bg)]/20 border border-[var(--border-color)]/40 p-6 rounded-3xl">
            <div className="h-6 w-32 bg-[var(--card)] rounded-lg pb-2 border-b border-[var(--border-color)]/40" />
            
            <div className="space-y-4">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-10 h-10 bg-[var(--card)] border border-[var(--border-color)]/50 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1 pt-1">
                    <div className="h-3 w-16 bg-[var(--card)] rounded" />
                    <div className="h-4 w-32 bg-[var(--card)] rounded" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border-color)]/50 space-y-3">
              <div className="h-4 w-28 bg-[var(--card)] rounded" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="w-9 h-9 bg-[var(--card)] border border-[var(--border-color)]/60 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
