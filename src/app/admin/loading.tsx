import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-9 w-60 bg-[var(--card)] rounded-xl" />
        <div className="h-4 w-96 bg-[var(--secondary-bg)]/80 rounded" />
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-[var(--secondary-bg)] rounded" />
              <div className="w-10 h-10 bg-[var(--secondary-bg)]/70 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-16 bg-[var(--secondary-bg)] rounded-lg" />
              <div className="h-3 w-32 bg-[var(--secondary-bg)]/60 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Large blocks (e.g. Charts & Tables) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border-color)]/80 p-6 rounded-3xl h-96 flex flex-col justify-between">
          <div className="h-5 w-40 bg-[var(--secondary-bg)] rounded" />
          <div className="flex-1 flex items-end gap-3 px-4 pt-10">
            {[30, 45, 25, 60, 40, 75, 50, 90, 65, 80].map((height, idx) => (
              <div 
                key={idx} 
                style={{ height: `${height}%` }} 
                className="flex-1 bg-[var(--secondary-bg)]/70 rounded-t-lg"
              />
            ))}
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border-color)]/80 p-6 rounded-3xl h-96 space-y-6">
          <div className="h-5 w-32 bg-[var(--secondary-bg)] rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-[var(--secondary-bg)]/80 shrink-0" />
                <div className="space-y-1.5 flex-1 pt-1">
                  <div className="h-3.5 w-3/4 bg-[var(--secondary-bg)] rounded" />
                  <div className="h-3 w-1/2 bg-[var(--secondary-bg)]/65 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
