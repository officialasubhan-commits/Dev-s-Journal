import React from "react";

/**
 * Loading skeleton for the Homepage.
 * Displays placeholder elements for the hero section, featured projects,
 * featured courses, featured certificates, and journal cards.
 * Uses Tailwind-like utility classes with custom CSS variables
 * defined in the global stylesheet.
 */
export default function HomepageLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl animate-pulse">
      {/* Hero Section */}
      <section className="space-y-6 text-center mb-12">
        <div className="h-8 w-48 bg-[var(--secondary-bg)] rounded-full mx-auto" />
        <div className="h-12 md:h-14 w-72 bg-[var(--card)] rounded-xl mx-auto" />
        <div className="h-4 w-96 bg-[var(--secondary-bg)]/80 rounded mx-auto" />
      </section>

      {/* Featured Projects */}
      <section className="mb-12">
        <div className="h-6 w-40 bg-[var(--secondary-bg)] rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl overflow-hidden flex flex-col h-96">
              <div className="h-52 bg-[var(--secondary-bg)]/70 w-full" />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-[var(--secondary-bg)] rounded-md" />
                  <div className="h-4 w-full bg-[var(--secondary-bg)]/60 rounded-md" />
                </div>
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
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="mb-12">
        <div className="h-6 w-40 bg-[var(--secondary-bg)] rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl p-6 space-y-4">
              <div className="h-5 w-3/4 bg-[var(--secondary-bg)] rounded" />
              <div className="h-4 w-1/2 bg-[var(--secondary-bg)]/80 rounded" />
              <div className="h-8 bg-[var(--secondary-bg)] rounded-xl" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Certificates */}
      <section className="mb-12">
        <div className="h-6 w-40 bg-[var(--secondary-bg)] rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl p-6 space-y-4">
              <div className="h-5 w-3/4 bg-[var(--secondary-bg)] rounded" />
              <div className="h-4 w-1/2 bg-[var(--secondary-bg)]/80 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Journal Cards */}
      <section>
        <div className="h-6 w-40 bg-[var(--secondary-bg)] rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 rounded-xl p-6 space-y-3">
              <div className="h-5 w-3/4 bg-[var(--secondary-bg)] rounded" />
              <div className="h-4 w-1/2 bg-[var(--secondary-bg)]/80 rounded" />
              <div className="h-4 w-1/3 bg-[var(--secondary-bg)]/60 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
