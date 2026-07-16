import React from "react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12 md:py-20 relative overflow-hidden">
      {/* Glow decorator replica */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[var(--primary)]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="container max-w-5xl mx-auto px-6 space-y-24 md:space-y-32 relative z-10 animate-pulse">
        {/* HERO SKELETON */}
        <div className="pt-12 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          <div className="max-w-2xl space-y-6 md:space-y-8 flex-1">
            <div className="h-6 w-32 bg-[var(--secondary-bg)] border border-[var(--border-color)]/30 rounded-full" />
            <div className="space-y-3">
              <div className="h-12 md:h-16 w-3/4 bg-[var(--card)] border border-[var(--border-color)]/20 rounded-2xl" />
              <div className="h-12 md:h-16 w-1/2 bg-[var(--card)] border border-[var(--border-color)]/20 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-[var(--secondary-bg)]/80 rounded-lg" />
              <div className="h-4 w-5/6 bg-[var(--secondary-bg)]/80 rounded-lg" />
            </div>
            <div className="flex gap-4 pt-2">
              <div className="h-11 w-36 bg-[var(--card)] border border-[var(--border-color)]/40 rounded-xl" />
              <div className="h-11 w-32 bg-[var(--card)] border border-[var(--border-color)]/40 rounded-xl" />
            </div>
          </div>
          
          <div className="hidden md:block w-80 shrink-0">
            <div className="bg-[var(--card)] rounded-3xl border border-[var(--border-color)]/80 p-6 flex flex-col gap-6 shadow-sm">
              <div className="aspect-square w-full rounded-2xl bg-[var(--secondary-bg)]/85 border border-[var(--border-color)]/50" />
              <div className="space-y-3">
                <div className="h-5 w-1/2 bg-[var(--secondary-bg)] rounded-md" />
                <div className="h-4 w-1/3 bg-[var(--secondary-bg)]/80 rounded-md" />
                <div className="h-10 w-full bg-[var(--secondary-bg)]/50 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 px-6 bg-[var(--secondary-bg)]/40 rounded-2xl border border-[var(--border-color)]/30">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="space-y-2 text-center md:text-left">
              <div className="h-9 w-16 bg-[var(--card)] rounded-lg mx-auto md:mx-0" />
              <div className="h-3.5 w-24 bg-[var(--card)] rounded mx-auto md:mx-0" />
              <div className="h-3 w-16 bg-[var(--card)]/60 rounded mx-auto md:mx-0" />
            </div>
          ))}
        </div>

        {/* PROJECTS SECTION */}
        <div className="space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-7 w-48 bg-[var(--card)] rounded-lg" />
              <div className="h-4 w-72 bg-[var(--secondary-bg)] rounded" />
            </div>
            <div className="h-4 w-20 bg-[var(--secondary-bg)] rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((idx) => (
              <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl overflow-hidden flex flex-col h-96">
                <div className="aspect-video bg-[var(--secondary-bg)]/70 border-b border-[var(--border-color)]/40" />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-[var(--secondary-bg)] rounded-md" />
                    <div className="h-4 w-full bg-[var(--secondary-bg)]/60 rounded-md" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 w-14 bg-[var(--secondary-bg)] rounded" />
                    <div className="h-5 w-14 bg-[var(--secondary-bg)] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
