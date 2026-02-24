"use client";

import { CountdownTimer } from "@/components/countdown-timer";
import { DailyPlayButton } from "@/components/daily-play-button";

export function GameActions() {
  return (
    <div className="scale-90 sm:scale-100 2xl:scale-110 4xl:scale-125">
      <CountdownTimer />
      <DailyPlayButton />
    </div>
  );
}
