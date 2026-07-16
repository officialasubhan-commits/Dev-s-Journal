import React from "react";

export default function CertificationsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12 md:py-20 animate-pulse">
      <div className="container max-w-5xl mx-auto px-6 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center md:text-left">
          <div className="h-5 w-40 bg-[var(--secondary-bg)] border border-[var(--border-color)]/30 rounded-full mx-auto md:mx-0" />
          <div className="h-10 md:h-12 w-80 bg-[var(--card)] rounded-xl mx-auto md:mx-0" />
          <div className="h-4 w-96 bg-[var(--secondary-bg)]/80 rounded mx-auto md:mx-0" />
        </div>

        {/* Filters */}
        <div className="bg-[var(--card)] border border-[var(--border-color)]/80 p-4 rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 h-10 bg-[var(--background)] border border-[var(--border-color)] rounded-xl" />
            <div className="h-10 w-44 bg-[var(--background)] border border-[var(--border-color)] rounded-xl" />
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-color)]/50">
            <div className="h-6 w-12 bg-[var(--background)] rounded" />
            <div className="h-6 w-20 bg-[var(--background)] rounded-full" />
            <div className="h-6 w-16 bg-[var(--background)] rounded-full" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl overflow-hidden flex flex-col h-80">
              <div className="aspect-video bg-[var(--secondary-bg)]/70 border-b border-[var(--border-color)]/60" />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-[var(--secondary-bg)] rounded" />
                  <div className="h-6 w-3/4 bg-[var(--secondary-bg)] rounded-md" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]/50">
                  <div className="h-8 w-16 bg-[var(--secondary-bg)] rounded-lg" />
                  <div className="h-6 w-20 bg-[var(--secondary-bg)]/60 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
