import React from "react";

export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl animate-pulse space-y-16">
      {/* Intro section skeleton */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="w-48 h-48 rounded-3xl bg-[var(--secondary-bg)] shrink-0 border border-[var(--border-color)]/50" />
        <div className="flex-1 space-y-4 w-full">
          <div className="h-4 w-24 bg-[var(--secondary-bg)] rounded-full" />
          <div className="h-9 w-64 bg-[var(--card)] rounded-xl" />
          <div className="h-4 w-36 bg-[var(--secondary-bg)]/80 rounded" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-[var(--secondary-bg)]/50 rounded" />
            <div className="h-4 w-full bg-[var(--secondary-bg)]/50 rounded" />
            <div className="h-4 w-4/5 bg-[var(--secondary-bg)]/50 rounded" />
          </div>
        </div>
      </div>

      {/* Skills section skeleton */}
      <div className="space-y-6">
        <div className="h-6 w-32 bg-[var(--card)] rounded-lg" />
        <div className="flex flex-wrap gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className="h-8 w-20 bg-[var(--secondary-bg)]/60 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="space-y-8">
        <div className="h-6 w-40 bg-[var(--card)] rounded-lg" />
        <div className="space-y-6 relative pl-6 border-l border-[var(--border-color)]/70">
          {[1, 2].map((idx) => (
            <div key={idx} className="relative space-y-3">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[var(--background)] border-4 border-[var(--border-color)]" />
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="h-5 w-48 bg-[var(--secondary-bg)] rounded" />
                  <div className="h-4 w-32 bg-[var(--secondary-bg)]/70 rounded" />
                </div>
                <div className="h-6 w-20 bg-[var(--secondary-bg)]/50 rounded-full" />
              </div>
              <div className="h-4 w-full bg-[var(--secondary-bg)]/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
