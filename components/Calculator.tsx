'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ── Tier data: period → daily rate ─────────────────────────── */
const tiers = [
  { days: 15, rate: 1.0 },
  { days: 20, rate: 1.2 },
  { days: 30, rate: 1.5 },
  { days: 45, rate: 1.7 },
  { days: 60, rate: 1.9 },
  { days: 75, rate: 2.1 },
  { days: 90, rate: 2.3 },
  { days: 120, rate: 2.5 },
  { days: 150, rate: 2.8 },
  { days: 180, rate: 3.0 },
];

const riskLabel = (days: number) => {
  if (days <= 30) return { text: 'Low', color: 'text-green-400 border-green-400/30 bg-green-400/10' };
  if (days <= 75) return { text: 'Medium', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' };
  return { text: 'High', color: 'text-red-400 border-red-400/30 bg-red-400/10' };
};

/* ── Seeded random for consistent chart noise ────────────────── */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/* ── Helpers ─────────────────────────────────────────────────── */
const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

const fmtFull = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

/* ── Custom tooltip ──────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800/95 backdrop-blur-sm border border-dark-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[10px] text-dark-400">Day {label}</p>
      <p className="text-sm font-bold text-white">≈ {fmtFull(payload[0].value)}</p>
    </div>
  );
};

/* ── Custom draggable slider ─────────────────────────────────── */
function CustomSlider({
  min, max, step, value, onChange, marks,
}: {
  min: number; max: number; step: number; value: number;
  onChange: (v: number) => void;
  marks?: { value: number; label: string }[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const getValueFromX = useCallback((clientX: number) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const steps = Math.round((pct * (max - min)) / step);
    return Math.max(min, Math.min(max, min + steps * step));
  }, [min, max, step, value]);

  const startDrag = useCallback((startX: number) => {
    onChange(getValueFromX(startX));

    const onMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      onChange(getValueFromX(x));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  }, [getValueFromX, onChange]);

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative pt-2 pb-1 select-none">
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-[6px] rounded-full cursor-pointer"
        style={{ background: `linear-gradient(to right, #0ea5e9 0%, #a855f7 ${pct}%, rgb(229 231 235 / 0.25) ${pct}%)` }}
        onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX); }}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      >
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[2.5px] border-primary-500 shadow-md hover:shadow-lg hover:scale-110 active:scale-115 active:shadow-xl transition-all cursor-grab active:cursor-grabbing"
          style={{ left: `${pct}%` }}
          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startDrag(e.clientX); }}
          onTouchStart={(e) => { e.stopPropagation(); startDrag(e.touches[0].clientX); }}
        />
      </div>

      {/* Marks */}
      {marks && (
        <div className="relative mt-1.5 h-4">
          {marks.map((m) => {
            const mPct = ((m.value - min) / (max - min)) * 100;
            return (
              <span
                key={m.value}
                className={`absolute -translate-x-1/2 text-[9px] cursor-pointer transition-colors ${
                  m.value === value ? 'text-primary-400 font-bold' : 'text-gray-400 dark:text-dark-500 hover:text-gray-600'
                }`}
                style={{ left: `${mPct}%` }}
                onClick={() => onChange(m.value)}
              >
                {m.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export default function Calculator() {
  const [amount, setAmount] = useState(1000);
  const [tierIndex, setTierIndex] = useState(4);

  const tier = tiers[tierIndex];
  const risk = riskLabel(tier.days);

  /* Compute growth + noisy chart data */
  const { chartData, dailyProfit, totalProfit, totalReturn, totalPercent } = useMemo(() => {
    const rate = tier.rate / 100;
    const daily = amount * rate;
    const data: { day: number; value: number }[] = [];

    // Generate realistic noisy chart
    // Use seed based on tier+amount for consistent noise per config
    const seed = tier.days * 1000 + Math.floor(amount / 100);

    // First pass: compute ideal line (for anchoring start/end)
    const exactTotal = amount + daily * tier.days;
    const totalGain = exactTotal - amount;

    // Second pass: generate realistic volatile path
    // The idea: random walk that drifts upward, with real drawdowns
    // We normalize at the end so final value = exactTotal
    let rawPath: number[] = [0]; // cumulative deltas, start at 0
    let cumulative = 0;

    for (let d = 1; d <= tier.days; d++) {
      const r1 = seededRandom(seed + d * 13);
      const r2 = seededRandom(seed + d * 31 + 7);
      const r3 = seededRandom(seed + d * 53 + 19);

      // Base upward drift per day
      const drift = totalGain / tier.days;

      // Big variance — sometimes negative days, sometimes 2-3x days
      // Combine multiple randoms for more natural distribution
      const volatility = drift * 2.5;
      const shock = ((r1 - 0.5) + (r2 - 0.5) * 0.7 + (r3 - 0.5) * 0.4) * volatility;

      // Occasional bigger drawdowns (≈15% chance)
      const bigMove = r1 > 0.85 ? -drift * 1.5 : r2 > 0.9 ? drift * 2 : 0;

      cumulative += drift + shock + bigMove;
      rawPath.push(cumulative);
    }

    // Normalize: scale rawPath so that rawPath[last] = totalGain
    const rawEnd = rawPath[rawPath.length - 1];
    const scale = rawEnd !== 0 ? totalGain / rawEnd : 1;

    for (let d = 0; d <= tier.days; d++) {
      const normalized = amount + rawPath[d] * scale;
      // Ensure never goes below 85% of initial (realistic floor)
      const floored = Math.max(normalized, amount * 0.85);
      data.push({ day: d, value: Math.round(floored) });
    }

    // Force exact start and end
    data[0].value = amount;
    data[data.length - 1].value = Math.round(exactTotal);

    const profit = exactTotal - amount;
    const pct = (profit / amount) * 100;

    return {
      chartData: data,
      dailyProfit: daily,
      totalProfit: profit,
      totalReturn: exactTotal,
      totalPercent: pct,
    };
  }, [amount, tier]);

  /* Amount input handler */
  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw) || 0;
    setAmount(Math.min(num, 100000));
  };

  /* YAxis formatter */
  const yFormat = (v: number) => {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
    return `$${v}`;
  };

  return (
    <section className="relative py-12 sm:py-16 bg-white dark:bg-dark-900 overflow-hidden">
      {/* Subtle bg */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(14,165,233,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,165,233,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — compact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-primary-500" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">Calculator</span>
            <div className="w-8 h-0.5 bg-primary-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
            Estimate Your <span className="text-gradient">Potential Returns</span>
          </h2>
        </motion.div>

        {/* Calculator card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 to-accent-500/15 rounded-2xl blur-2xl transform scale-[1.02]" />

          <div className="relative bg-gradient-to-br from-gray-50 dark:from-dark-800/95 to-gray-100 dark:to-dark-900/95 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-dark-700 p-5 sm:p-6 lg:p-8">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-8">

              {/* ── LEFT: Controls ── */}
              <div className="space-y-5">
                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-400 mb-2">
                    Investment Amount
                  </label>
                  <div className="relative mb-3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-primary-500">$</span>
                    <input
                      type="text"
                      value={new Intl.NumberFormat('en-US').format(amount)}
                      onChange={handleAmountInput}
                      className="w-full pl-9 pr-3 py-3 bg-white dark:bg-dark-900/50 border border-gray-300 dark:border-dark-600 focus:border-primary-500 rounded-xl text-gray-900 dark:text-white text-xl font-bold focus:outline-none transition-colors"
                    />
                  </div>
                  <CustomSlider min={50} max={100000} step={50} value={amount} onChange={setAmount} />
                  <div className="flex justify-between text-[10px] text-gray-400 dark:text-dark-500 mt-1">
                    <span>$50</span>
                    <span>$100,000</span>
                  </div>
                </div>

                {/* Period */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-400">
                      Reservation Period
                    </label>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${risk.color}`}>
                      {risk.text}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={tier.days}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                      >
                        {tier.days}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-sm text-gray-500 dark:text-dark-400">days</span>
                    <span className="ml-auto text-base font-semibold text-primary-500">
                      {tier.rate}%<span className="text-xs text-gray-400 dark:text-dark-500 font-normal">/day</span>
                    </span>
                  </div>

                  <CustomSlider
                    min={0}
                    max={tiers.length - 1}
                    step={1}
                    value={tierIndex}
                    onChange={setTierIndex}
                    marks={tiers.map((t, i) => ({ value: i, label: `${t.days}` }))}
                  />
                </div>

                {/* Results */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-gray-100 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg">
                    <span className="text-xs text-gray-500 dark:text-dark-400">Daily Profit</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">≈ {fmtFull(dailyProfit)}</span>
                      <span className="text-[10px] text-green-400 font-semibold">+{tier.rate}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-gray-100 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700 rounded-lg">
                    <span className="text-xs text-gray-500 dark:text-dark-400">Est. Total Profit</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-green-400">≈ {fmt(totalProfit)}</span>
                      <span className="text-[10px] text-green-400 font-semibold">+{totalPercent.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-300">
                        Total After {tier.days} Days
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={Math.round(totalReturn)}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-xl sm:text-2xl font-bold text-gradient"
                        >
                          ≈ {fmt(totalReturn)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-dark-400 mt-0.5">
                      {fmt(amount)} invested → ≈ {fmt(totalProfit)} profit ({totalPercent.toFixed(0)}% return)
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Chart ── */}
              <div className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Growth Projection</h3>
                  <span className="text-[10px] text-gray-400 dark:text-dark-500 italic">≈ estimated, may vary</span>
                </div>

                <div className="flex-1 min-h-[240px] sm:min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="calcGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                          <stop offset="50%" stopColor="#d946ef" stopOpacity={0.1} />
                          <stop offset="100%" stopColor="#d946ef" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="calcLine" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        tickFormatter={(v) => `${v}d`}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        tickFormatter={yFormat}
                        width={48}
                        domain={[
                          (dataMin: number) => Math.floor(dataMin * 0.95),
                          (dataMax: number) => Math.ceil(dataMax * 1.02),
                        ]}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="url(#calcLine)"
                        strokeWidth={2}
                        fill="url(#calcGrad)"
                        animationDuration={500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded" />
                    <span className="text-gray-400 dark:text-dark-500">
                      Estimated growth
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 dark:text-dark-500">
                    <span>{fmt(amount)}</span>
                    <span>→</span>
                    <span className="text-green-400 font-semibold">≈ {fmt(totalReturn)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-gray-400 dark:text-dark-500 mt-4">
          * Estimated returns based on historical performance. Actual results may vary depending on market conditions and bot activity.
        </p>
      </div>

    </section>
  );
}
