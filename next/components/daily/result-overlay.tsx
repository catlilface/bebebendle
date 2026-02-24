"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { UserAnswer } from "@/types/game";

interface ResultOverlayProps {
  answer: UserAnswer | null;
  isVisible: boolean;
}

export function ResultOverlay({ answer, isVisible }: ResultOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && answer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-30 pointer-events-none"
          style={{
            boxShadow: answer.isCorrect
              ? "inset 0 0 150px 80px rgba(34,197,94,0.6), inset 0 0 300px 150px rgba(34,197,94,0.3)"
              : "inset 0 0 150px 80px rgba(239,68,68,0.6), inset 0 0 300px 150px rgba(239,68,68,0.3)",
          }}
        >
          <div className="flex h-full items-center justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-8 sm:gap-16">
                <div className="text-center">
                  <p className="pixel-text text-5xl font-black text-white sm:text-7xl">
                    {answer.percentageA}%
                  </p>
                </div>
                <div className="pixel-text text-4xl font-black text-white sm:text-6xl">
                  VS
                </div>
                <div className="text-center">
                  <p className="pixel-text text-5xl font-black text-white sm:text-7xl">
                    {answer.percentageB}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
