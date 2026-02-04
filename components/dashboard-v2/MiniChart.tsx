'use client';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export default function MiniChart({ data, color = '#10b981', height = 60 }: MiniChartProps) {
  // Convert array of numbers to chart data format
  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${color})`}
          isAnimationActive={true}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
