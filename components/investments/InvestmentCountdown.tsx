'use client';

import Countdown, { CountdownRenderProps } from 'react-countdown';

interface InvestmentCountdownProps {
  nextdate: number; // Unix timestamp in seconds
}

// Renderer for countdown display
const renderer = ({ hours, minutes, seconds }: CountdownRenderProps) => {
  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <span className="font-mono text-xs text-primary-400 font-semibold">
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
};

export default function InvestmentCountdown({ nextdate }: InvestmentCountdownProps) {
  // Convert Unix timestamp (seconds) to milliseconds for Countdown
  const targetDate = nextdate * 1000;

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-xs text-dark-400">Next:</span>
      <Countdown date={targetDate} renderer={renderer} />
    </div>
  );
}
