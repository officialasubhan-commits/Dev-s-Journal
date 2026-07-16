import React from "react";

export default function JournalLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl animate-pulse">
      <div className="space-y-12">
        <div className="space-y-4 text-center md:text-left flex flex-col md:items-start items-center">
          <div className="h-6 w-32 bg-[var(--secondary-bg)] rounded-full" />
          <div className="h-10 md:h-12 w-64 bg-[var(--card)] rounded-xl" />
          <div className="h-4 w-96 bg-[var(--secondary-bg)]/80 rounded" />
        </div>

        <div className="space-y-6 relative">
          <div className="hidden md:block absolute left-8 top-4 bottom-4 w-px bg-[var(--border-color)] z-0" />
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="relative z-10 md:pl-20">
              <div className="hidden md:flex absolute left-[22px] top-8 w-5 h-5 rounded-full bg-[var(--background)] border-4 border-[var(--border-color)] z-20" />
              <div className="bg-[var(--card)] border border-[var(--border-color)]/70 p-6 md:p-8 rounded-3xl space-y-4">
                <div className="flex gap-4">
                  <div className="h-6 w-24 bg-[var(--secondary-bg)] rounded-full" />
                  <div className="h-6 w-16 bg-[var(--secondary-bg)]/60 rounded" />
                </div>
                <div className="h-6 w-3/4 bg-[var(--secondary-bg)] rounded-md" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-[var(--secondary-bg)]/50 rounded" />
                  <div className="h-4 w-5/6 bg-[var(--secondary-bg)]/50 rounded" />
                </div>
                <div className="flex gap-2 pt-2">
                  <span className="h-6 w-14 bg-[var(--secondary-bg)]/75 rounded-lg" />
                  <span className="h-6 w-14 bg-[var(--secondary-bg)]/75 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
