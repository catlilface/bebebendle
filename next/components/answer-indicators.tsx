"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Answer {
  isCorrect: boolean;
}

interface AnswerIndicatorsProps {
  answers: Answer[];
  className?: string;
  delayIncrement?: number;
}

export function AnswerIndicators({
  answers,
  className,
  delayIncrement = 0.05,
}: AnswerIndicatorsProps) {
  return (
    <div className={cn("mb-8 flex flex-wrap justify-center gap-3", className)}>
      {answers.map((answer, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * delayIncrement, duration: 0.3 }}
          className={cn(
            "pixel-btn flex h-12 w-12 items-center justify-center text-lg font-bold sm:h-14 sm:w-14",
            answer.isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
          )}
        >
          {answer.isCorrect ? "✓" : "✗"}
        </motion.div>
      ))}
    </div>
  );
}
