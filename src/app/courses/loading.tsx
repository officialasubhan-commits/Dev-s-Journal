import React from "react";

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12 md:py-20 animate-pulse">
      <div className="container max-w-5xl mx-auto px-6 space-y-12">
        {/* Header Skeleton */}
        <div className="space-y-4 text-center md:text-left">
          <div className="h-5 w-36 bg-[var(--secondary-bg)] border border-[var(--border-color)]/30 rounded-full mx-auto md:mx-0" />
          <div className="h-10 md:h-12 w-64 bg-[var(--card)] rounded-xl mx-auto md:mx-0" />
          <div className="h-4 w-96 bg-[var(--secondary-bg)]/80 rounded mx-auto md:mx-0" />
        </div>

        {/* Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-[var(--card)] border border-[var(--border-color)]/80 p-3 rounded-2xl">
          <div className="w-full sm:max-w-xs h-9 bg-[var(--background)] border border-[var(--border-color)] rounded-xl" />
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="h-9 w-32 bg-[var(--background)] border border-[var(--border-color)] rounded-xl" />
            <div className="h-9 w-20 bg-[var(--background)] border border-[var(--border-color)] rounded-xl" />
          </div>
        </div>

        {/* Sidebar Filters + Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div className="bg-[var(--card)] border border-[var(--border-color)]/80 p-5 rounded-2xl space-y-6 hidden md:block">
            <div className="h-5 w-24 bg-[var(--secondary-bg)] rounded pb-2 border-b border-[var(--border-color)]/40" />
            <div className="space-y-3">
              <div className="h-4 w-32 bg-[var(--secondary-bg)]/80 rounded" />
              <div className="h-3 w-28 bg-[var(--secondary-bg)]/60 rounded" />
              <div className="h-3 w-28 bg-[var(--secondary-bg)]/60 rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-20 bg-[var(--secondary-bg)]/80 rounded" />
              <div className="h-3 w-28 bg-[var(--secondary-bg)]/60 rounded" />
              <div className="h-3 w-28 bg-[var(--secondary-bg)]/60 rounded" />
            </div>
            <div className="h-9 w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl" />
          </div>

          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl overflow-hidden flex flex-col h-96">
                <div className="aspect-video bg-[var(--secondary-bg)]/70 border-b border-[var(--border-color)]/60" />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="h-3 w-24 bg-[var(--secondary-bg)] rounded" />
                    <div className="h-5 w-full bg-[var(--secondary-bg)] rounded-md" />
                    <div className="h-3 w-5/6 bg-[var(--secondary-bg)]/80 rounded-md" />
                  </div>
                  <div className="h-px bg-[var(--border-color)]/45 w-full" />
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-5 w-20 bg-[var(--secondary-bg)] rounded" />
                    <div className="h-8 w-16 bg-[var(--secondary-bg)] rounded-lg" />
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
