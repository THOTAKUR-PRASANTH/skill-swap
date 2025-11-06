"use client";

export function MessageSkeleton() {
  const items = [1, 2, 3, 4, 5];

  return (
    <div className="animate-pulse px-4 pt-20 space-y-5">
      {items.map((i) =>
        i % 2 === 0 ? (
          // Right bubble
          <div key={i} className="flex justify-end gap-2">
            <div className="bg-neutral-800/80 rounded-xl h-5 w-48"></div>
            <div className="w-8 h-8 rounded-full bg-neutral-800"></div>
          </div>
        ) : (
          // Left bubble
          <div key={i} className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-800"></div>
            <div className="bg-neutral-800/80 rounded-xl h-5 w-40"></div>
          </div>
        )
      )}
    </div>
  );
}
