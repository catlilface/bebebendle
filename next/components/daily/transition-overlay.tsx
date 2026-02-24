"use client";

import { AnimatePresence, motion } from "framer-motion";

interface TransitionOverlayProps {
  isVisible: boolean;
}

export function TransitionOverlay({ isVisible }: TransitionOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="fixed inset-0 z-40 bg-black"
        />
      )}
    </AnimatePresence>
  );
}
