import React from "react";

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4" role="status" aria-label="Loading content...">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 animate-pulse motion-reduce:animate-none space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-48 bg-zinc-800 rounded" />
            <div className="h-5 w-20 bg-zinc-800 rounded-full" />
          </div>
          <div className="h-3 w-3/4 bg-zinc-800/80 rounded" />
          <div className="h-3 w-1/2 bg-zinc-800/60 rounded" />
        </div>
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
};
