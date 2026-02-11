"use client";

import { useState, useEffect } from "react";

function calculateTimeLeft() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialize = () => {
      setMounted(true);
      setTimeLeft(calculateTimeLeft());
    };
    
    // Use setTimeout to defer the state update
    const initTimeout = setTimeout(initialize, 0);
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => {
      clearTimeout(initTimeout);
      clearInterval(timer);
    };
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="mb-6 text-center">
        <p 
          className="text-base sm:text-lg font-medium mb-1"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            color: "white",
            textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          }}
        >
          До следующего дейлика
        </p>
        <p 
          className="text-2xl sm:text-3xl font-black"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            color: "white",
            textShadow: "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          }}
        >
          00:00:00
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 text-center">
      <p 
        className="text-base sm:text-lg font-medium mb-1"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          color: "white",
          textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
        }}
      >
        До следующего дейлика
      </p>
      <p 
        className="text-2xl sm:text-3xl font-black"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          color: "white",
          textShadow: "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
        }}
      >
        {timeLeft}
      </p>
    </div>
  );
}
