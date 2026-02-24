"use client";

interface VsBadgeProps {
  hidden?: boolean;
}

export function VsBadge({ hidden }: VsBadgeProps) {
  if (hidden) return null;

  return (
    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
      <div className="pixel-btn flex h-12 w-12 items-center justify-center bg-white text-lg font-black text-black md:h-16 md:w-16 md:text-xl lg:h-20 lg:w-20 lg:text-2xl">
        VS
      </div>
    </div>
  );
}
