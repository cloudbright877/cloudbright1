'use client';

import Image from 'next/image';
import {
  BarChart3, Shield, Users, Globe, DollarSign,
  Lock, KeyRound, Fingerprint, ShieldCheck, Zap, Timer,
  Rocket, Smartphone, Brain, CalendarDays, Boxes,
  Mail, MessageCircle, Store,
} from 'lucide-react';

function Slide({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <section id={id} className="relative w-[1920px] h-[1080px] bg-dark-900 overflow-hidden flex flex-col"
      style={{ fontFamily: "'Zalando Sans', 'Inter', system-ui, sans-serif" }}>
      {children}
    </section>
  );
}

function Hex({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={className} style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}>{children}</div>;
}

function GradientBar({ w = 'w-40' }: { w?: string }) {
  return <div className={`${w} h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 shadow-[0_0_20px_rgba(79,70,229,0.5)]`} />;
}

function Label({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full backdrop-blur-sm mb-4">
      <span className="text-[14px] font-bold text-primary-200 tracking-[3px] uppercase">{children}</span>
    </div>
  );
}

function Footer({ n }: { n: number }) {
  return (
    <div className="absolute bottom-7 left-12 right-12 flex justify-between z-20">
      <div className="flex items-center gap-3 opacity-50">
        <Image src="/logo2.svg" alt="" width={18} height={18} />
        <span className="text-dark-400 text-[13px] tracking-widest">CLOUDBRIGHT</span>
      </div>
      <span className="text-dark-500 text-[13px]">{String(n).padStart(2, '0')} / 12</span>
    </div>
  );
}

function Img({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`rounded-2xl border-2 border-dashed border-dark-600/60 bg-dark-800/40 flex items-center justify-center text-dark-500 text-[14px] text-center leading-relaxed p-5 ${className}`}>
      {label}
    </div>
  );
}

/* Glow orbs - appear on every slide */
function Glows({ variant = 0 }: { variant?: number }) {
  const configs = [
    // variant 0: top-right primary, bottom-left accent
    <>
      <div className="absolute -top-40 -right-20 w-[600px] h-[600px] rounded-full bg-primary-500/[0.12] blur-[140px]" />
      <div className="absolute -bottom-32 -left-20 w-[450px] h-[450px] rounded-full bg-accent-500/[0.08] blur-[120px]" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-primary-500/[0.04] blur-[100px]" />
    </>,
    // variant 1: center-left primary, bottom-right accent
    <>
      <div className="absolute top-20 -left-32 w-[550px] h-[550px] rounded-full bg-primary-500/[0.10] blur-[130px]" />
      <div className="absolute -bottom-40 right-40 w-[500px] h-[500px] rounded-full bg-accent-500/[0.10] blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] rounded-full bg-primary-500/[0.05] blur-[90px]" />
    </>,
    // variant 2: top-center accent, bottom-left primary
    <>
      <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-accent-500/[0.10] blur-[130px]" />
      <div className="absolute -bottom-20 -left-40 w-[550px] h-[550px] rounded-full bg-primary-500/[0.10] blur-[140px]" />
      <div className="absolute bottom-1/3 right-20 w-[300px] h-[300px] rounded-full bg-accent-500/[0.04] blur-[100px]" />
    </>,
    // variant 3: dual sides
    <>
      <div className="absolute top-10 -right-40 w-[600px] h-[600px] rounded-full bg-primary-500/[0.14] blur-[150px]" />
      <div className="absolute bottom-10 -left-40 w-[600px] h-[600px] rounded-full bg-accent-500/[0.10] blur-[130px]" />
    </>,
  ];
  return <div className="absolute inset-0 pointer-events-none">{configs[variant % 4]}</div>;
}

export default function PresentationPage() {
  return (
    <div className="flex flex-col">

      {/* ═══ 1 — TITLE ═══ */}
      <Slide id="slide-1">
        <Glows variant={3} />
        <Hex className="absolute right-[-50px] top-[-60px] w-[420px] h-[420px] bg-gradient-to-br from-primary-500/[0.15] to-accent-500/[0.05]" />
        <Hex className="absolute right-[200px] top-[340px] w-[180px] h-[180px] border-2 border-accent-500/[0.15] bg-transparent" />
        <Hex className="absolute left-[-50px] bottom-[-30px] w-[220px] h-[220px] border-2 border-primary-500/[0.08] bg-transparent" />

        <div className="flex-1 flex gap-16 items-center px-[120px] relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-5 mb-10">
              <Image src="/logo2.svg" alt="Cloudbright" width={60} height={60} />
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500/10 border border-primary-500/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm font-semibold text-primary-200 tracking-wider">INVESTOR PRESENTATION</span>
              </div>
            </div>
            <GradientBar w="w-60" />
            <h1 className="text-[86px] font-black leading-[0.95] mt-8 mb-6"><span className="text-gradient">CLOUDBRIGHT</span></h1>
            <p className="text-[40px] text-white/90 font-light leading-snug">Copy the Best Bots.<br /><span className="text-gradient">Collect the Profits.</span></p>
            <div className="flex items-center gap-6 mt-14 text-dark-300 text-base">
              <span className="px-4 py-2 rounded-lg bg-dark-800/60 border border-dark-700/50">February 2026</span>
              <span className="px-4 py-2 rounded-lg bg-dark-800/60 border border-dark-700/50">Hong Kong Cloud Bright Software Limited</span>
            </div>
          </div>
          <Img label="Hero visual / Platform mockup" className="w-[520px] h-[500px]" />
        </div>
        <Footer n={1} />
      </Slide>

      {/* ═══ 2 — PROBLEM ═══ */}
      <Slide id="slide-2">
        <Glows variant={1} />
        <div className="px-[120px] pt-16">
          <Label>The Problem</Label>
          <GradientBar />
          <h2 className="text-[52px] font-extrabold leading-tight mt-5 max-w-[850px]">Retail investors are <span className="text-gradient">locked out</span> of professional trading</h2>
        </div>
        <div className="flex gap-10 px-[120px] mt-12 flex-1">
          <div className="flex flex-col gap-6 flex-1">
            {[
              { icon: Lock, num: '$500K+', desc: 'Minimum investment for institutional algorithmic trading strategies' },
              { icon: Shield, num: '0%', desc: 'Transparency into actual strategy performance and real trade history' },
              { icon: Timer, num: '24/7', desc: 'Markets never sleep, but human traders can\'t trade around the clock' },
            ].map(({ icon: Icon, num, desc }) => (
              <div key={num} className="relative rounded-2xl bg-dark-800/60 border border-dark-700/50 p-7 flex-1">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 to-accent-500" />
                <div className="flex items-start gap-5">
                  <Hex className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/25">
                    <Icon className="w-6 h-6 text-white" />
                  </Hex>
                  <div>
                    <div className="text-[42px] font-extrabold text-gradient leading-none">{num}</div>
                    <p className="text-[17px] text-dark-300 mt-2 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Img label="Image: Locked vault&#10;or barrier visual" className="w-[480px] self-stretch mb-16" />
        </div>
        <Footer n={2} />
      </Slide>

      {/* ═══ 3 — SOLUTION ═══ */}
      <Slide id="slide-3">
        <Glows variant={0} />
        <div className="px-[120px] pt-16">
          <Label>The Solution</Label>
          <GradientBar />
          <h2 className="text-[52px] font-extrabold leading-tight mt-5 max-w-[900px]">Professional copy-trading<br /><span className="text-gradient">accessible to everyone</span></h2>
        </div>
        <div className="flex gap-14 px-[120px] mt-10 flex-1">
          <div className="flex-1">
            <ul className="space-y-5 mt-2">
              {[
                ['One-click copy trading', 'no technical skills required'],
                ['Start from $50', 'accessible to everyone globally'],
                ['100+ verified bots', 'across all risk levels and strategies'],
                ['Full transparency', 'every trade, every metric, real-time'],
                ['Commission only on profit', 'our success depends on yours'],
                ['9+ exchanges', 'Binance, Bybit, OKX, KuCoin, Kraken & more'],
              ].map(([b, r]) => (
                <li key={b} className="flex items-start gap-4 text-[19px] text-dark-200">
                  <Hex className="w-3.5 h-3.5 bg-gradient-to-r from-primary-500 to-accent-500 mt-2 flex-shrink-0" />
                  <span><strong className="text-white font-semibold">{b}</strong> — {r}</span>
                </li>
              ))}
            </ul>
          </div>
          <Img label="Image: Platform dashboard&#10;screenshot or mockup" className="w-[560px] self-stretch mb-16" />
        </div>
        <Footer n={3} />
      </Slide>

      {/* ═══ 4 — HOW IT WORKS ═══ */}
      <Slide id="slide-4">
        <Glows variant={2} />
        <div className="px-[120px] pt-16">
          <Label>How It Works</Label>
          <GradientBar />
          <h2 className="text-[52px] font-extrabold leading-tight mt-5">Start in <span className="text-gradient">3 Simple Steps</span></h2>
        </div>
        <div className="flex items-start justify-center gap-8 px-[100px] mt-14 flex-1">
          {[
            { n: '01', t: 'Top Up', d: 'Deposit via crypto or fiat.\nMinimum just $50.', icon: DollarSign },
            { n: '02', t: 'Copy a Bot', d: 'Browse marketplace, pick\na verified bot, one click.', icon: Store },
            { n: '03', t: 'Collect Profits', d: 'Bot trades 24/7.\nWithdraw anytime.', icon: BarChart3 },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div className="absolute inset-[-16px] bg-gradient-to-br from-primary-500 to-accent-500 blur-3xl opacity-25" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }} />
                  <Hex className="w-[190px] h-[190px] bg-gradient-to-br from-primary-500 to-accent-500 flex flex-col items-center justify-center relative shadow-2xl shadow-primary-500/30">
                    <Icon className="w-8 h-8 text-white/80 mb-1" />
                    <span className="text-[48px] font-black text-white">{s.n}</span>
                  </Hex>
                </div>
                {i < 2 && (
                  <div className="absolute" style={{ left: `${370 + i * 560}px`, top: '310px' }}>
                    <svg width="100" height="24" viewBox="0 0 100 24" fill="none">
                      <defs><linearGradient id={`a${i}`} x1="0" y1="12" x2="100" y2="12"><stop stopColor="#4F46E5" /><stop offset="1" stopColor="#06B6D4" /></linearGradient></defs>
                      <path d="M0 12h88m0 0l-10-10m10 10l-10 10" stroke={`url(#a${i})`} strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                <h3 className="text-[28px] font-bold mt-8 text-white">{s.t}</h3>
                <p className="text-[16px] text-dark-400 mt-3 text-center whitespace-pre-line">{s.d}</p>
                <Img label={`Image: Step ${i + 1}`} className="w-[280px] h-[150px] mt-6" />
              </div>
            );
          })}
        </div>
        <Footer n={4} />
      </Slide>

      {/* ═══ 5 — PRODUCT ═══ */}
      <Slide id="slide-5">
        <Glows variant={1} />
        <div className="px-[120px] pt-16">
          <Label>Product</Label>
          <GradientBar />
          <h2 className="text-[52px] font-extrabold leading-tight mt-5">The Complete <span className="text-gradient">Copy Trading</span> Platform</h2>
        </div>
        <div className="flex gap-12 px-[120px] mt-10 flex-1">
          <div className="flex-1 grid grid-cols-2 gap-5 self-start">
            {[
              { icon: BarChart3, t: 'Marketplace', d: '100+ verified bots: grid, scalping, market making, leverage', c: 'from-violet-500/20 to-indigo-500/20' },
              { icon: Shield, t: 'Risk Levels', d: 'Conservative to aggressive. Filter by Sharpe, drawdown, ROI', c: 'from-emerald-500/20 to-teal-500/20' },
              { icon: Zap, t: 'Real-Time Dashboard', d: 'Live P&L, equity curves, trade history, whale alerts', c: 'from-amber-500/20 to-orange-500/20' },
              { icon: Globe, t: 'Multi-Exchange', d: 'Binance, Bybit, OKX, KuCoin, Kraken — unified', c: 'from-sky-500/20 to-blue-500/20' },
            ].map(({ icon: Icon, t, d, c }) => (
              <div key={t} className="relative rounded-2xl bg-dark-800/60 border border-dark-700/50 p-6">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 to-accent-500" />
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c} border border-white/5 flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-accent-400" />
                  </div>
                  <h3 className="text-[20px] font-bold text-white">{t}</h3>
                </div>
                <p className="text-[15px] text-dark-300 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <Img label="Image: Product screenshots&#10;Marketplace + Dashboard" className="w-[520px] self-stretch mb-16" />
        </div>
        <Footer n={5} />
      </Slide>

      {/* ═══ 6 — BUSINESS MODEL ═══ */}
      <Slide id="slide-6">
        <Glows variant={3} />
        <div className="px-[120px] pt-16">
          <Label>Business Model</Label>
          <GradientBar />
          <h2 className="text-[52px] font-extrabold leading-tight mt-5">Aligned With <span className="text-gradient">Your Success</span></h2>
        </div>
        <div className="flex gap-16 px-[120px] mt-10 flex-1 items-start">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-[-24px] bg-gradient-to-br from-primary-500/25 to-accent-500/15 blur-[60px] rounded-full" />
              <Hex className="w-[280px] h-[280px] bg-dark-800/80 border-[3px] border-accent-500/30 flex flex-col items-center justify-center relative">
                <div className="text-[72px] font-black text-gradient leading-none">1-2%</div>
                <div className="text-[16px] text-dark-300 mt-2">Commission on Profit</div>
              </Hex>
            </div>
            <div className="mt-8 px-8 py-5 rounded-2xl bg-dark-800/60 border border-accent-500/20 text-center">
              <p className="text-[22px] font-bold text-accent-400">If you don&apos;t earn — we don&apos;t earn</p>
            </div>
          </div>
          <div className="flex-1">
            <ul className="space-y-5">
              {[
                ['Zero upfront fees', 'no subscriptions, no hidden costs'],
                ['Revenue scales with user success', 'incentives fully aligned'],
                ['Lock-in periods: 7-180 days', 'longer lock = higher returns'],
                ['Transparent fee structure', 'visible before you copy any bot'],
                ['Zero platform usage fees', 'deposits, dashboard, analytics — free'],
              ].map(([b, r]) => (
                <li key={b} className="flex items-start gap-4 text-[18px] text-dark-200">
                  <span className="text-accent-400 font-bold text-[20px] mt-0.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">✓</span>
                  <span><strong className="text-white font-semibold">{b}</strong> — {r}</span>
                </li>
              ))}
            </ul>
            <Img label="Image: Revenue model diagram&#10;or growth projection" className="w-full h-[180px] mt-8" />
          </div>
        </div>
        <Footer n={6} />
      </Slide>

      {/* ═══ 7 — TRACTION ═══ */}
      <Slide id="slide-7">
        <Glows variant={0} />
        <div className="px-[120px] pt-16">
          <Label>Traction & Metrics</Label>
          <GradientBar />
          <h2 className="text-[52px] font-extrabold leading-tight mt-5">January 2026 <span className="text-gradient">Performance</span></h2>
        </div>
        <div className="px-[120px] mt-12">
          <div className="flex gap-8 justify-center">
            {[
              { v: '18.7%', l: 'Average\nMonthly Return' },
              { v: '34.2%', l: 'Top Bot\nPerformance' },
              { v: '100+', l: 'Verified\nTrading Bots' },
              { v: '9+', l: 'Supported\nExchanges' },
              { v: '$50', l: 'Minimum\nInvestment' },
            ].map(({ v, l }) => (
              <div key={v} className="relative">
                <div className="absolute inset-[-12px] bg-gradient-to-br from-primary-500/20 to-accent-500/10 blur-2xl rounded-full" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }} />
                <Hex className="w-[210px] h-[210px] bg-dark-800/60 border-2 border-primary-500/25 flex flex-col items-center justify-center text-center relative">
                  <div className="text-[38px] font-extrabold text-gradient">{v}</div>
                  <div className="text-[12px] text-dark-400 mt-1 whitespace-pre-line leading-tight">{l}</div>
                </Hex>
              </div>
            ))}
          </div>
          <div className="flex gap-6 justify-center mt-10">
            {[
              { v: '22.4%', l: 'Momentum' },
              { v: '15.8%', l: 'Mean-Reversion' },
              { v: '12.1%', l: 'Arbitrage' },
            ].map(({ v, l }) => (
              <div key={l} className="rounded-2xl bg-dark-800/60 border border-dark-700/50 px-14 py-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 to-accent-500" />
                <div className="text-[34px] font-extrabold text-gradient">{v}</div>
                <div className="text-[15px] text-dark-400 mt-1">{l}</div>
              </div>
            ))}
          </div>
          <Img label="Image: Performance chart / equity curve" className="w-full h-[150px] mt-8" />
        </div>
        <Footer n={7} />
      </Slide>

      {/* ═══ 8 — MARKET ═══ */}
      <Slide id="slide-8">
        <Glows variant={2} />
        <div className="px-[120px] pt-16">
          <Label>Market Opportunity</Label>
          <GradientBar />
          <h2 className="text-[52px] font-extrabold leading-tight mt-5">Massive and <span className="text-gradient">Growing Market</span></h2>
        </div>
        <div className="flex gap-14 px-[120px] mt-10 flex-1">
          <div className="flex-1 space-y-7 mt-2">
            {[
              { icon: DollarSign, v: '$200B+', d: 'Crypto ETF AUM — institutional money is here' },
              { icon: Globe, v: '$3.2T', d: 'Total crypto market cap in 2026' },
              { icon: Users, v: '500M+', d: 'Global crypto users — growing 20% YoY' },
              { icon: Rocket, v: 'Copy Trading', d: 'Fastest-growing segment in crypto fintech' },
            ].map(({ icon: Icon, v, d }) => (
              <div key={v} className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-[-10px] bg-gradient-to-br from-primary-500 to-accent-500 blur-2xl opacity-20" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }} />
                  <Hex className="w-[80px] h-[80px] bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 relative shadow-lg shadow-primary-500/25">
                    <Icon className="w-7 h-7 text-white" />
                  </Hex>
                </div>
                <div>
                  <div className="text-[32px] font-extrabold text-gradient">{v}</div>
                  <div className="text-[17px] text-dark-300">{d}</div>
                </div>
              </div>
            ))}
          </div>
          <Img label="Image: TAM / SAM / SOM diagram&#10;or market growth chart" className="w-[520px] self-stretch mb-16" />
        </div>
        <Footer n={8} />
      </Slide>

      {/* ═══ 9 — SECURITY ═══ */}
      <Slide id="slide-9">
        <Glows variant={1} />
        <div className="px-[120px] pt-16">
          <Label>Technology & Security</Label>
          <GradientBar />
          <h2 className="text-[52px] font-extrabold leading-tight mt-5"><span className="text-gradient">Bank-Grade</span> Infrastructure</h2>
        </div>
        <div className="flex gap-14 px-[120px] mt-8 flex-1">
          <div className="grid grid-cols-3 gap-6 self-start">
            {[
              { icon: Lock, v: 'AES-256', d: 'Military-grade\nencryption' },
              { icon: KeyRound, v: 'HSM', d: 'Hardware key\nstorage' },
              { icon: Fingerprint, v: '2FA', d: 'Mandatory\nauthentication' },
              { icon: ShieldCheck, v: 'Multi-Sig', d: 'Multi-signature\nauthorization' },
              { icon: Zap, v: '99.9%', d: 'Platform\nuptime' },
              { icon: Timer, v: '<200ms', d: 'Response\nlatency' },
            ].map(({ icon: Icon, v, d }) => (
              <div key={v} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="absolute inset-[-8px] bg-gradient-to-br from-primary-500/15 to-accent-500/10 blur-xl" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }} />
                  <Hex className="w-[130px] h-[130px] bg-dark-800/60 border-2 border-primary-500/25 flex flex-col items-center justify-center relative">
                    <Icon className="w-5 h-5 text-accent-400 mb-1" />
                    <div className="text-[18px] font-extrabold text-accent-400">{v}</div>
                  </Hex>
                </div>
                <div className="text-[13px] text-dark-300 mt-3 whitespace-pre-line leading-snug">{d}</div>
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col">
            <ul className="space-y-4">
              {['Independent security audits passed', 'SSL/TLS encryption everywhere', 'Multi-layer DDoS protection', '24/7 security monitoring', 'Active bug bounty program', 'Continuous penetration testing'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[17px] text-dark-200">
                  <span className="text-accent-400 font-bold text-[18px] drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Img label="Image: Security badge&#10;or audit certificate" className="w-full h-[180px] mt-auto mb-16" />
          </div>
        </div>
        <Footer n={9} />
      </Slide>

      {/* ═══ 10 — TEAM ═══ */}
      <Slide id="slide-10">
        <Glows variant={0} />
        <div className="px-[120px] pt-16">
          <Label>Team</Label>
          <GradientBar />
          <h2 className="text-[52px] font-extrabold leading-tight mt-5">40+ Professionals, <span className="text-gradient">One Mission</span></h2>
        </div>
        <div className="flex gap-10 justify-center px-[120px] mt-12 flex-1">
          {[
            { name: 'Anyun Yang', role: 'CEO & Co-Founder', desc: '15 years institutional finance\nGoldman Sachs, HSBC Digital Assets' },
            { name: 'Dong Aiguo', role: 'CTO & Co-Founder', desc: 'HFT systems & ML expert\nLeads Engineering & AI team' },
            { name: 'James Chen', role: 'COO & Co-Founder', desc: 'Operations & strategy\nExchange partnerships' },
            { name: 'Samarth Ramesh', role: 'Head of Security', desc: 'Cybersecurity & compliance\nEncryption, HSM, audit oversight' },
          ].map((p) => (
            <div key={p.name} className="flex flex-col items-center text-center flex-1">
              <div className="relative">
                <div className="absolute inset-[-14px] bg-gradient-to-br from-primary-500/20 to-accent-500/10 blur-2xl" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }} />
                <Hex className="w-[200px] h-[200px] bg-dark-800/60 border-[2.5px] border-primary-500/25 flex items-center justify-center relative">
                  <span className="text-dark-500 text-[14px]">Photo</span>
                </Hex>
              </div>
              <h3 className="text-[22px] font-bold mt-5 text-white">{p.name}</h3>
              <div className="text-[16px] text-accent-400 font-semibold mt-1">{p.role}</div>
              <p className="text-[14px] text-dark-400 mt-2 whitespace-pre-line">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="px-[120px] pb-20 text-center">
          <div className="inline-flex gap-8 px-10 py-4 rounded-2xl bg-dark-800/50 border border-dark-700/50">
            {['Engineering & AI', 'Security & Compliance', 'Operations & Strategy', 'Community & Support'].map((d, i) => (
              <span key={d} className="flex items-center gap-8">
                <span className="text-[15px] text-dark-400">{d}</span>
                {i < 3 && <span className="text-dark-700">|</span>}
              </span>
            ))}
          </div>
        </div>
        <Footer n={10} />
      </Slide>

      {/* ═══ 11 — ROADMAP ═══ */}
      <Slide id="slide-11">
        <Glows variant={3} />
        <div className="px-[120px] pt-16">
          <Label>Roadmap</Label>
          <GradientBar />
          <h2 className="text-[52px] font-extrabold leading-tight mt-5">Building for the <span className="text-gradient">Long Term</span></h2>
        </div>
        <div className="px-[120px] mt-14 flex-1 relative">
          <div className="absolute top-[82px] left-[120px] right-[120px] h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
          <div className="flex gap-5 relative z-10">
            {[
              { p: 'Q1 2026', t: 'Platform Launch', d: '100+ bots, 9 exchanges\nSocial trading features', active: true, icon: Rocket },
              { p: 'Q2 2026', t: 'Mobile App', d: 'iOS & Android\nPush notifications', active: false, icon: Smartphone },
              { p: 'Q3 2026', t: 'AI Strategy Builder', d: 'Custom bots via\nplain English prompts', active: false, icon: Brain },
              { p: 'Q4 2026', t: 'HK Summit', d: 'First annual\nCloudbright conference', active: false, icon: CalendarDays },
              { p: '2027+', t: 'DEX & DAO', d: 'DeFi integration\nCommunity governance', active: false, icon: Boxes },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.p} className="flex-1 flex flex-col items-center text-center">
                  <div className="relative">
                    {m.active && <div className="absolute inset-[-18px] bg-gradient-to-br from-primary-500 to-accent-500 blur-3xl opacity-35" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }} />}
                    <Hex className={`w-[140px] h-[140px] flex flex-col items-center justify-center relative shadow-lg ${m.active ? 'bg-gradient-to-br from-primary-500 to-accent-500 shadow-primary-500/30' : 'bg-dark-800/60 border-2 border-primary-500/25 shadow-primary-500/5'}`}>
                      <Icon className={`w-5 h-5 mb-1 ${m.active ? 'text-white' : 'text-accent-400'}`} />
                      <div className={`text-[14px] font-bold ${m.active ? 'text-white' : 'text-accent-400'}`}>{m.p}</div>
                    </Hex>
                  </div>
                  <h3 className="text-[20px] font-bold mt-12 text-white">{m.t}</h3>
                  <p className="text-[14px] text-dark-400 mt-2 whitespace-pre-line">{m.d}</p>
                </div>
              );
            })}
          </div>
          <Img label="Image: Roadmap visual (optional)" className="w-full h-[120px] mt-10" />
        </div>
        <Footer n={11} />
      </Slide>

      {/* ═══ 12 — CONTACT ═══ */}
      <Slide id="slide-12">
        <Glows variant={3} />
        <Hex className="absolute right-[-80px] top-[-100px] w-[480px] h-[480px] bg-gradient-to-br from-primary-500/[0.15] to-accent-500/[0.05]" />
        <Hex className="absolute right-[200px] bottom-[-50px] w-[250px] h-[250px] border-2 border-accent-500/[0.12] bg-transparent" />
        <Hex className="absolute left-[-50px] bottom-[120px] w-[200px] h-[200px] border-[1.5px] border-primary-500/[0.08] bg-transparent" />

        <div className="flex-1 flex flex-col justify-center px-[120px] relative z-10">
          <div className="flex items-center gap-5 mb-12">
            <Image src="/logo2.svg" alt="Cloudbright" width={52} height={52} />
            <span className="text-dark-300 text-[15px] font-semibold tracking-[4px]">CLOUDBRIGHT</span>
          </div>
          <h2 className="text-[76px] font-black leading-none mb-4"><span className="text-gradient">Join Us</span></h2>
          <GradientBar w="w-60" />
          <p className="text-[30px] text-accent-400 font-light mt-6 mb-14">Copy the Best Bots. Collect the Profits.</p>
          <div className="flex gap-20 items-start">
            <div className="space-y-5">
              {[
                { icon: Globe, text: 'cloudbright.io' },
                { icon: Mail, text: 'support@cloudbright.io' },
                { icon: MessageCircle, text: 't.me/cloudbright_io_public' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-[-6px] bg-gradient-to-br from-primary-500 to-accent-500 blur-xl opacity-25" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }} />
                    <Hex className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 relative">
                      <Icon className="w-5 h-5 text-white" />
                    </Hex>
                  </div>
                  <span className="text-[20px] text-dark-200">{text}</span>
                </div>
              ))}
              <div className="pt-6 text-[16px] text-dark-500">Hong Kong Cloud Bright Software Limited</div>
            </div>
            <Img label="QR Code" className="w-[200px] h-[200px]" />
          </div>
        </div>
        <Footer n={12} />
      </Slide>

    </div>
  );
}
