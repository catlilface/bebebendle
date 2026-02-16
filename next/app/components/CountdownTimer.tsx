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

  const textShadowStyle = {
    fontFamily: "var(--font-pixel), monospace",
    color: "white",
    textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000",
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="mb-4 sm:mb-6 2xl:mb-8 text-center">
        <p 
          className="text-sm sm:text-base md:text-lg 2xl:text-xl 4xl:text-2xl font-medium mb-1 2xl:mb-2"
          style={textShadowStyle}
        >
          До следующего дейлика
        </p>
        <p 
          className="text-xl sm:text-2xl md:text-3xl 2xl:text-4xl 4xl:text-5xl font-black"
          style={textShadowStyle}
        >
          00:00:00
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 sm:mb-6 2xl:mb-8 text-center">
      <p 
        className="text-sm sm:text-base md:text-lg 2xl:text-xl 4xl:text-2xl font-medium mb-1 2xl:mb-2"
        style={textShadowStyle}
      >
        До следующего дейлика
      </p>
      <p 
        className="text-xl sm:text-2xl md:text-3xl 2xl:text-4xl 4xl:text-5xl font-black"
        style={textShadowStyle}
      >
        {timeLeft}
      </p>
    </div>
  );
}
