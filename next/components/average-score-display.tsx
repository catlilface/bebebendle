"use client";

import { cn } from "@/lib/utils";

interface AverageScoreDisplayProps {
  averageScore: number;
  total?: number;
  className?: string;
}

export function AverageScoreDisplay({
  averageScore,
  total = 10,
  className,
}: AverageScoreDisplayProps) {
  return (
    <div className={cn("pixel-container rounded-2xl bg-zinc-900/80 p-6", className)}>
      <p className="pixel-text mb-2 text-lg text-white">Средний результат всех игроков</p>
      <p className="pixel-text text-5xl font-black text-zinc-300 sm:text-6xl">
        {averageScore}/{total}
      </p>
    </div>
  );
}
