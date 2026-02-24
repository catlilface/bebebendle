"use client";

import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  total?: number;
  label?: string;
  className?: string;
}

export function ScoreDisplay({
  score,
  total = 10,
  label = "Ваш результат",
  className,
}: ScoreDisplayProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="pixel-container rounded-2xl bg-zinc-900/80 p-6">
        <p className="pixel-text mb-2 text-lg text-white">{label}</p>
        <p className="pixel-text text-5xl font-black text-white sm:text-6xl">
          {score}/{total}
        </p>
      </div>
    </div>
  );
}
