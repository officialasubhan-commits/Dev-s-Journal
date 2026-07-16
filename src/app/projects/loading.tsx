import React from "react";

export default function ProjectsLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl animate-pulse">
      <div className="space-y-16">
        <div className="space-y-6 text-center flex flex-col items-center">
          <div className="h-6 w-24 bg-[var(--secondary-bg)] border border-[var(--border-color)]/30 rounded-full" />
          <div className="h-10 md:h-12 w-64 bg-[var(--card)] rounded-xl" />
          <div className="h-4 w-96 bg-[var(--secondary-bg)]/80 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl overflow-hidden flex flex-col h-96">
              <div className="h-52 bg-[var(--secondary-bg)]/70 w-full" />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-[var(--secondary-bg)] rounded-md" />
                  <div className="h-4 w-full bg-[var(--secondary-bg)]/60 rounded-md" />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="h-5 w-12 bg-[var(--secondary-bg)] rounded" />
                    <span className="h-5 w-12 bg-[var(--secondary-bg)] rounded" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <div className="h-8 bg-[var(--secondary-bg)] rounded-xl flex-1" />
                    <div className="h-8 bg-[var(--secondary-bg)] rounded-xl flex-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
