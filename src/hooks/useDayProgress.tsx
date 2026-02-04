"use client";
import getRandomInt from "@/lib/getRandomInt";
import { useEffect, useState } from "react";

function useDayProgress() {
  const now = Math.round(new Date().getTime() / 1000);
  const secondsInDay = 24 * 60 * 60;
  const secondsUntilMidnight = secondsInDay - (now % secondsInDay);
  const startProgress = 100 - (secondsUntilMidnight / secondsInDay) * 100;
  const [progress, setProgress] = useState(startProgress >= 100 ? 100 : startProgress);

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      const now = Math.round(new Date().getTime() / 1000);
      const secondsInDay = 24 * 60 * 60;
      const secondsUntilMidnight = secondsInDay - (now % secondsInDay);
      const startProgress = 100 - (secondsUntilMidnight / secondsInDay) * 100;
      setProgress(startProgress >= 100 ? 100 : startProgress);
    }, getRandomInt(500, 2000));

    //Clearing the interval
    return () => clearInterval(interval);
  }, [progress]);

  return progress;
}

export default useDayProgress;
