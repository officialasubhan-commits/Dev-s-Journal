import React from "react";

/**
 * Loading skeleton for the Notifications page.
 * Shows placeholder UI while the notifications list loads.
 * Consistent with other loading components (pulse animation, CSS vars).
 */
export default function NotificationsLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl animate-pulse">
      {/* Header */}
      <section className="space-y-4 text-center md:text-left mb-8">
        <div className="h-6 w-32 bg-[var(--secondary-bg)] rounded-full mx-auto md:mx-0" />
        <div className="h-4 w-48 bg-[var(--secondary-bg)]/80 rounded mx-auto md:mx-0" />
      </section>

      {/* List of notification placeholders */}
      <section className="space-y-6">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border-color)]/70 rounded-xl p-4"
          >
            <div className="w-10 h-10 bg-[var(--secondary-bg)] rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-[var(--secondary-bg)] rounded" />
              <div className="h-3 w-1/2 bg-[var(--secondary-bg)]/60 rounded" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
