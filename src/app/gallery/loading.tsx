import React from "react";

export default function GalleryLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl animate-pulse space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center md:text-left flex flex-col md:items-start items-center">
        <div className="h-6 w-32 bg-[var(--secondary-bg)] rounded-full" />
        <div className="h-10 md:h-12 w-64 bg-[var(--card)] rounded-xl" />
        <div className="h-4 w-96 bg-[var(--secondary-bg)]/80 rounded" />
      </div>

      {/* Album filter options */}
      <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="h-9 w-24 bg-[var(--card)] border border-[var(--border-color)]/70 rounded-full" />
        ))}
      </div>

      {/* Masonry/Grid of images */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
          // Vary the heights slightly for a masonry feel
          const heightClass = idx % 3 === 0 ? "h-64" : idx % 2 === 0 ? "h-80" : "h-56";
          return (
            <div 
              key={idx} 
              className={`bg-[var(--card)] border border-[var(--border-color)]/60 rounded-2xl overflow-hidden ${heightClass}`}
            />
          );
        })}
      </div>
    </div>
  );
}
