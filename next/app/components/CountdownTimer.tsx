"use client";

import { useState, useEffect } from "react";

function calculateTimeLeft() {
  const now = new Date();

  // Calculate time until 00:00 UTC (midnight UTC)
  const tomorrowUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
    ),
  );

  const diff = tomorrowUTC.getTime() - now.getTime();

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
    width: "fit-content",
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="mb-4 sm:mb-6 2xl:mb-8 lg:text-black flex flex-col items-center uppercase">
        <p
          className="text-xl sm:text-2xl md:text-[2vw] font-medium mb-1 2xl:mb-2"
          style={textShadowStyle}
        >
          До следующего дейлика
        </p>
        <p
          className="text-xl sm:text-2xl md:text-[2vw] font-medium"
          style={textShadowStyle}
        >
          00:00:00
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 sm:mb-6 2xl:mb-8 lg:text-black flex flex-col items-center uppercase">
      <p
        className="text-xl sm:text-2xl md:text-[2vw] font-medium mb-1 2xl:mb-2"
        style={textShadowStyle}
      >
        До следующего дейлика
      </p>
      <p
        className="text-xl sm:text-2xl md:text-[2vw] font-medium"
        style={textShadowStyle}
      >
        {timeLeft}
      </p>
    </div>
  );
}
