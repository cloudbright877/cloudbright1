import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const outputDir = path.join(rootDir, 'public', 'blog');

// Tailwind color name → hex mapping
const tw = {
  'blue-500': '#3b82f6', 'indigo-500': '#6366f1', 'cyan-500': '#06b6d4',
  'fuchsia-500': '#d946ef', 'purple-500': '#a855f7', 'violet-500': '#8b5cf6',
  'orange-500': '#f97316', 'red-500': '#ef4444', 'pink-500': '#ec4899',
  'green-500': '#22c55e', 'emerald-500': '#10b981', 'teal-500': '#14b8a6',
  'yellow-500': '#eab308', 'amber-500': '#f59e0b', 'rose-500': '#f43f5e',
  'sky-500': '#0ea5e9',
};

// Category → gradient colors (synced with data.ts badge gradients)
const categoryColors = {
  'Company':          [tw['blue-500'],    tw['indigo-500']],
  'Education':        [tw['green-500'],   tw['emerald-500']],
  'Platform Updates': [tw['violet-500'],  tw['purple-500']],
  'Market Analysis':  [tw['orange-500'],  tw['red-500']],
  'Crypto News':      [tw['cyan-500'],    tw['blue-500']],
  'AI Trading':       [tw['fuchsia-500'], tw['pink-500']],
};

// Blog posts — coverTitle is a shorter/rephrased version of the article title
// Unsplash photo base URL helper
const uImg = (id) => `https://images.unsplash.com/${id}?w=1200&h=630&fit=crop&q=80`;

const posts = [
  { id: 1,  coverTitle: 'AI-Powered Crypto Trading', slug: 'ai-crypto-trading', category: 'AI Trading', variation: 'hexagons', bgImage: uImg('photo-1644925295849-f057b6ee1c66') },
  { id: 2,  coverTitle: 'The Bitcoin Halving Effect', slug: 'bitcoin-halving-impact', category: 'Market Analysis', variation: 'waves', bgImage: uImg('photo-1641352109623-f7b1eff605fd') },
  { id: 3,  coverTitle: 'Smart Contract Security 101', slug: 'smart-contract-security', category: 'Education', variation: 'network', bgImage: uImg('photo-1659177137555-2f1ba453f70c') },
  { id: 4,  coverTitle: 'Q1 2026 Bot Performance', slug: 'q1-2026-performance', category: 'Platform Updates', variation: 'diagonals', bgImage: uImg('photo-1639825752750-5061ded5503b') },
  { id: 5,  coverTitle: 'DeFi vs Traditional Finance', slug: 'defi-vs-tradfi', category: 'Crypto News', variation: 'hexagons', bgImage: uImg('photo-1667984510054-d4562f93621d') },
  { id: 6,  coverTitle: 'Copy Trading Portfolio Strategies', slug: 'portfolio-diversification', category: 'Education', variation: 'waves', bgImage: uImg('photo-1744782211816-c5224434614f') },
  { id: 7,  coverTitle: 'Institutional Crypto Adoption', slug: 'institutional-crypto', category: 'Market Analysis', variation: 'network', bgImage: uImg('photo-1621579385187-c12061b577be') },
  { id: 8,  coverTitle: 'Technical Analysis Mastery', slug: 'technical-analysis', category: 'Education', variation: 'diagonals', bgImage: uImg('photo-1745509267699-1b1db256601e') },
  { id: 9,  coverTitle: 'New Bot Verification Pipeline', slug: 'bot-verification', category: 'Platform Updates', variation: 'hexagons', bgImage: uImg('photo-1763568258696-32147bb44379') },
  { id: 10, coverTitle: 'Our Mission: Passive Crypto Income', slug: 'our-mission', category: 'Company', variation: 'waves', bgImage: uImg('photo-1642143231828-786fbd515a13') },
  { id: 11, coverTitle: '40+ Professionals, One Vision', slug: 'team-behind-cloudbright', category: 'Company', variation: 'network', bgImage: uImg('photo-1758691737387-a89bb8adf768') },
  { id: 12, coverTitle: 'Why Hong Kong?', slug: 'why-hong-kong', category: 'Company', variation: 'diagonals', bgImage: uImg('photo-1666899354442-d8b958627dd1') },
  { id: 13, coverTitle: 'Passing Security Audits', slug: 'security-audits', category: 'Company', variation: 'hexagons', bgImage: uImg('photo-1614064641938-3bbee52942c7') },
  { id: 14, coverTitle: 'From Idea to Launch', slug: 'engineering-story', category: 'Company', variation: 'waves', bgImage: uImg('photo-1763788427927-87bc7c1fbcf7') },
  { id: 15, coverTitle: 'Launch Day: What to Expect', slug: 'launch-day', category: 'Company', variation: 'network', bgImage: uImg('photo-1634097538301-5d5f8b09eb84') },
  { id: 16, coverTitle: 'Final Testing Phase', slug: 'final-testing', category: 'Company', variation: 'diagonals', bgImage: uImg('photo-1642188537432-41c8a331ebdb') },
  // Crypto News — Feb–Mar 2026
  { id: 17, coverTitle: 'The $2.56B Liquidation Event', slug: 'black-sunday-liquidation', category: 'Crypto News', variation: 'hexagons', bgImage: uImg('photo-1634097537825-b446635b2f7f') },
  { id: 18, coverTitle: 'IoTeX Bridge Hack: $4.3M', slug: 'iotex-bridge-hack', category: 'Crypto News', variation: 'waves', bgImage: uImg('photo-1568716353609-12ddc5c67f04') },
  { id: 19, coverTitle: '20 Million Bitcoin Mined', slug: '20-millionth-bitcoin', category: 'Crypto News', variation: 'network', bgImage: uImg('photo-1707075891510-960cc9ecfcd3') },
  { id: 20, coverTitle: 'BTC, ETH, SOL Are Commodities', slug: 'sec-cftc-crypto-commodities', category: 'Crypto News', variation: 'diagonals', bgImage: uImg('photo-1721352794721-9a2f91f8dcbd') },
  { id: 21, coverTitle: 'Resolv Labs: $23.8M Exploit', slug: 'resolv-labs-exploit', category: 'Crypto News', variation: 'hexagons', bgImage: uImg('photo-1719255417989-b6858e87359e') },
  // Market Analysis — Feb–Mar 2026
  { id: 22, coverTitle: 'CME Altcoin Futures Launch', slug: 'cme-altcoin-futures', category: 'Market Analysis', variation: 'waves', bgImage: uImg('photo-1704391905064-1e7400746c31') },
  { id: 23, coverTitle: 'Bitcoin Below $65K', slug: 'btc-below-65k-macro', category: 'Market Analysis', variation: 'network', bgImage: uImg('photo-1634097537825-b446635b2f7f') },
  { id: 24, coverTitle: 'Bitcoin ETFs Hit $200 Billion', slug: 'bitcoin-etf-200-billion', category: 'Market Analysis', variation: 'diagonals', bgImage: uImg('photo-1634979150688-9b59fc2be1a2') },
  { id: 25, coverTitle: 'Institutional Diamond Hands', slug: 'institutional-diamond-hands', category: 'Market Analysis', variation: 'hexagons', bgImage: uImg('photo-1621579385187-c12061b577be') },
  { id: 26, coverTitle: 'Solana vs Ethereum L2s', slug: 'solana-vs-ethereum-l2', category: 'Market Analysis', variation: 'waves', bgImage: uImg('photo-1639454276085-9f55d2db6570') },
  // AI Trading — Feb–Mar 2026
  { id: 27, coverTitle: 'AI Bots vs Black Sunday II', slug: 'ai-bots-black-sunday', category: 'AI Trading', variation: 'network', bgImage: uImg('photo-1617871772974-26b107fc4c88') },
  { id: 28, coverTitle: 'No-Code AI Trading', slug: 'no-code-ai-trading', category: 'AI Trading', variation: 'diagonals', bgImage: uImg('photo-1716436329475-4c55d05383bb') },
  { id: 29, coverTitle: 'Sentiment Analysis Bots', slug: 'sentiment-analysis-bots', category: 'AI Trading', variation: 'hexagons', bgImage: uImg('photo-1683721003111-070bcc053d8b') },
  { id: 30, coverTitle: 'The AI Token Rally', slug: 'ai-token-rally-bittensor', category: 'AI Trading', variation: 'waves', bgImage: uImg('photo-1716436330152-a58390897652') },
  { id: 31, coverTitle: 'AI vs Human Traders', slug: 'ai-vs-human-traders', category: 'AI Trading', variation: 'network', bgImage: uImg('photo-1763788427927-87bc7c1fbcf7') },
  // Gap-fill posts — Feb–Mar 2026
  { id: 32, coverTitle: 'Bitcoin $67K: ETF Outflows', slug: 'btc-67k-etf-outflows', category: 'Market Analysis', variation: 'diagonals', bgImage: uImg('photo-1707075891545-41b982930351') },
  { id: 33, coverTitle: 'HK Stablecoin Licenses', slug: 'hong-kong-stablecoin-licenses', category: 'Crypto News', variation: 'waves', bgImage: uImg('photo-1768321140168-fa4795cb03f8') },
  { id: 34, coverTitle: 'Trump vs GENIUS Act', slug: 'trump-genius-stablecoin-act', category: 'Crypto News', variation: 'diagonals', bgImage: uImg('photo-1526304640581-d334cdbbf45e') },
  { id: 35, coverTitle: 'AI Bear Market Detection', slug: 'ai-bots-bear-market-regimes', category: 'AI Trading', variation: 'hexagons', bgImage: uImg('photo-1748439435495-722cc1728b7e') },
  // Company & Platform Updates — Mar 2026 expansion
  { id: 36, coverTitle: 'Inside Our Beta Testing', slug: 'beta-testing-approach', category: 'Company', variation: 'waves', bgImage: uImg('photo-1642188537432-41c8a331ebdb') },
  { id: 37, coverTitle: 'Transparency & Open Metrics', slug: 'transparency-open-metrics', category: 'Company', variation: 'network', bgImage: uImg('photo-1761171720674-480e85f8fef3') },
  { id: 38, coverTitle: 'Launch Readiness Update', slug: 'launch-readiness-update', category: 'Company', variation: 'diagonals', bgImage: uImg('photo-1634097538301-5d5f8b09eb84') },
  { id: 39, coverTitle: '8 Exchanges Integrated', slug: 'multi-exchange-integration', category: 'Platform Updates', variation: 'hexagons', bgImage: uImg('photo-1558494949-ef010cbdcc31') },
  { id: 40, coverTitle: 'SOL & LTC Integrated', slug: 'sol-ltc-supported', category: 'Platform Updates', variation: 'waves', bgImage: uImg('photo-1640330271726-7031b9338462') },
  { id: 41, coverTitle: 'Introducing Whale Alerts', slug: 'whale-alerts-feature', category: 'Platform Updates', variation: 'network', bgImage: uImg('photo-1741269516075-afa74fbe0440') },
  { id: 42, coverTitle: 'March Beta Results', slug: 'march-beta-results', category: 'Platform Updates', variation: 'diagonals', bgImage: uImg('photo-1742076553114-cfd4f27de46f') },
  { id: 43, coverTitle: 'Social Feed Complete', slug: 'social-feed-complete', category: 'Platform Updates', variation: 'hexagons', bgImage: uImg('photo-1683721003111-070bcc053d8b') },
  { id: 44, coverTitle: '3 Strategies Verified', slug: 'new-strategies-verified', category: 'Platform Updates', variation: 'waves', bgImage: uImg('photo-1639825752750-5061ded5503b') },
  // Company — IDs 45–52
  { id: 45, coverTitle: 'How Cloudbright Works', slug: 'how-cloudbright-works', category: 'Company', variation: 'hexagons', bgImage: null, localLogo: '/logo2.svg' },
  { id: 46, coverTitle: 'What Makes a Good Bot?', slug: 'what-makes-good-trading-bot', category: 'Company', variation: 'waves', bgImage: uImg('photo-1635236269199-3c71295855b3') },
  { id: 47, coverTitle: 'Our Fee Model Explained', slug: 'fee-model-explained', category: 'Company', variation: 'network', bgImage: uImg('photo-1561525155-40a650192479') },
  { id: 48, coverTitle: 'Building for Beginners', slug: 'building-for-beginners', category: 'Company', variation: 'diagonals', bgImage: uImg('photo-1574274594359-16469ef77d81') },
  { id: 49, coverTitle: 'Copy Trading Industry 2026', slug: 'copy-trading-industry-2026', category: 'Company', variation: 'hexagons', bgImage: uImg('photo-1657525641283-76b45d0534ba') },
  { id: 50, coverTitle: 'Your Funds Are Safe', slug: 'funds-security-custodial', category: 'Company', variation: 'waves', bgImage: uImg('photo-1556740714-a8395b3bf30f') },
  { id: 51, coverTitle: 'Wall Street to Web3', slug: 'wall-street-to-web3', category: 'Company', variation: 'network', bgImage: uImg('photo-1635236198091-33d5aa8466cc') },
  { id: 52, coverTitle: 'Our Growth Plans', slug: 'cloudbright-growth-plans', category: 'Company', variation: 'diagonals', bgImage: uImg('photo-1716279083224-d366e6d4144d') },
  // AI Trading — IDs 53–64
  { id: 53, coverTitle: 'What Is a Trading Bot?', slug: 'what-is-trading-bot', category: 'AI Trading', variation: 'hexagons', bgImage: uImg('photo-1658225282648-b199eb2a4830') },
  { id: 54, coverTitle: 'Copy vs Manual Trading', slug: 'copy-vs-manual-trading', category: 'AI Trading', variation: 'waves', bgImage: uImg('photo-1716279083559-ffc3a863c457') },
  { id: 55, coverTitle: 'Bot Performance Metrics', slug: 'bot-performance-metrics', category: 'AI Trading', variation: 'network', bgImage: uImg('photo-1651340791611-615c3e30ba58') },
  { id: 56, coverTitle: 'How AI Predicts Prices', slug: 'ai-predicts-price-movements', category: 'AI Trading', variation: 'diagonals', bgImage: uImg('photo-1716279083176-60af7a63cb03') },
  { id: 57, coverTitle: 'Types of Trading Strategies', slug: 'types-of-trading-strategies', category: 'AI Trading', variation: 'hexagons', bgImage: uImg('photo-1640772394431-20018a3e68a8') },
  { id: 58, coverTitle: 'Risk Management in AI', slug: 'risk-management-ai-trading', category: 'AI Trading', variation: 'waves', bgImage: uImg('photo-1634542984003-e0fb8e200e91') },
  { id: 59, coverTitle: 'The Role of Backtesting', slug: 'role-of-backtesting', category: 'AI Trading', variation: 'network', bgImage: uImg('photo-1649274496773-c40eacd66e2d') },
  { id: 60, coverTitle: 'AI Trading Myths Debunked', slug: 'ai-trading-myths', category: 'AI Trading', variation: 'diagonals', bgImage: uImg('photo-1640772393331-893f71575fc9') },
  { id: 61, coverTitle: 'Machine Learning Strategies', slug: 'machine-learning-strategies', category: 'AI Trading', variation: 'hexagons', bgImage: uImg('photo-1716279083500-04bb3c7576ff') },
  { id: 62, coverTitle: 'When Bots Lose Money', slug: 'bot-loses-money-drawdowns', category: 'AI Trading', variation: 'waves', bgImage: uImg('photo-1652533625932-25d5104161a1') },
  { id: 63, coverTitle: 'Choose Your First Bot', slug: 'choose-first-bot', category: 'AI Trading', variation: 'network', bgImage: uImg('photo-1716279083223-006db39251e1') },
  { id: 64, coverTitle: 'Future of AI Trading', slug: 'future-ai-trading', category: 'AI Trading', variation: 'diagonals', bgImage: uImg('photo-1738737271801-d404a575d870') },
  // Market Analysis — IDs 65–74
  { id: 65, coverTitle: 'What Moves Crypto Prices?', slug: 'what-moves-crypto-prices', category: 'Market Analysis', variation: 'hexagons', bgImage: uImg('photo-1556741533-411cf82e4e2d') },
  { id: 66, coverTitle: 'Bull & Bear Markets', slug: 'bull-bear-markets', category: 'Market Analysis', variation: 'waves', bgImage: uImg('photo-1639322537228-f710d846310a') },
  { id: 67, coverTitle: 'Bitcoin Dominance', slug: 'bitcoin-dominance', category: 'Market Analysis', variation: 'network', bgImage: uImg('photo-1639762681485-074b7f938ba0') },
  { id: 68, coverTitle: 'Crypto Market Cap Explained', slug: 'crypto-market-capitalization', category: 'Market Analysis', variation: 'diagonals', bgImage: uImg('photo-1694219782948-afcab5c095d3') },
  { id: 69, coverTitle: 'Interest Rates & Crypto', slug: 'interest-rates-inflation-crypto', category: 'Market Analysis', variation: 'hexagons', bgImage: uImg('photo-1526378800651-c32d170fe6f8') },
  { id: 70, coverTitle: 'Altcoin Seasons Explained', slug: 'altcoin-seasons', category: 'Market Analysis', variation: 'waves', bgImage: uImg('photo-1559526324-593bc073d938') },
  { id: 71, coverTitle: 'Crypto Correlations', slug: 'crypto-correlations', category: 'Market Analysis', variation: 'network', bgImage: uImg('photo-1488590528505-98d2b5aba04b') },
  { id: 72, coverTitle: 'Liquidity in Crypto', slug: 'liquidity-in-crypto', category: 'Market Analysis', variation: 'diagonals', bgImage: uImg('photo-1666816943035-15c29931e975') },
  { id: 73, coverTitle: 'Reading Crypto Charts', slug: 'reading-crypto-charts', category: 'Market Analysis', variation: 'hexagons', bgImage: uImg('photo-1631864031824-d636e1dc5292') },
  { id: 74, coverTitle: 'Whale Watching', slug: 'whale-watching-market', category: 'Market Analysis', variation: 'waves', bgImage: uImg('photo-1509017174183-0b7e0278f1ec') },
  // Crypto News — IDs 75–84
  { id: 75, coverTitle: 'What Are Stablecoins?', slug: 'what-are-stablecoins', category: 'Crypto News', variation: 'network', bgImage: uImg('photo-1639762681057-408e52192e55') },
  { id: 76, coverTitle: 'Bitcoin ETFs Explained', slug: 'bitcoin-etf-explained', category: 'Crypto News', variation: 'diagonals', bgImage: uImg('photo-1526374965328-7f61d4dc18c5') },
  { id: 77, coverTitle: 'Crypto Hacks & Protection', slug: 'crypto-hacks-protection', category: 'Crypto News', variation: 'hexagons', bgImage: uImg('photo-1605810230434-7631ac76ec81') },
  { id: 78, coverTitle: 'CBDCs & Crypto', slug: 'cbdc-impact-crypto', category: 'Crypto News', variation: 'waves', bgImage: uImg('photo-1664022617645-cf71791942e4') },
  { id: 79, coverTitle: 'Crypto Mining & Environment', slug: 'crypto-mining-environment', category: 'Crypto News', variation: 'network', bgImage: uImg('photo-1643000296927-f4f1c8722b7d') },
  { id: 80, coverTitle: 'Global Crypto Regulation', slug: 'crypto-regulation-worldwide', category: 'Crypto News', variation: 'diagonals', bgImage: uImg('photo-1556742111-a301076d9d18') },
  { id: 81, coverTitle: 'Layer 2 Solutions', slug: 'layer-2-solutions', category: 'Crypto News', variation: 'hexagons', bgImage: uImg('photo-1617396900799-f4ec2b43c7ae') },
  { id: 82, coverTitle: 'DeFi for Beginners', slug: 'defi-for-beginners', category: 'Crypto News', variation: 'waves', bgImage: uImg('photo-1487058792275-0ad4aaf24ca7') },
  { id: 83, coverTitle: 'NFTs Beyond Art', slug: 'nfts-beyond-art', category: 'Crypto News', variation: 'network', bgImage: uImg('photo-1556742502-ec7c0e9f34b1') },
  { id: 84, coverTitle: 'The Crypto Tax Question', slug: 'crypto-tax-question', category: 'Crypto News', variation: 'diagonals', bgImage: uImg('photo-1643481436451-30f6d77d75a0') },
];

// Deterministic pseudo-random based on seed
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hexPoints(size) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${Math.cos(angle) * size},${Math.sin(angle) * size}`);
  }
  return pts.join(' ');
}

function generateHexagons(c1, c2, seed) {
  const rand = seededRandom(seed);
  let svg = '';

  // Hex grid — placed on a structured grid to avoid overlaps
  // Only place hexagons on the edges/corners, keeping center clear for text
  const positions = [
    // Top-left cluster
    { x: 60,  y: 70,  size: 45, rot: 0 },
    { x: 150, y: 35,  size: 35, rot: 15 },
    { x: 30,  y: 170, size: 30, rot: -10 },
    // Top-right cluster
    { x: 1050, y: 50,  size: 55, rot: 10 },
    { x: 1140, y: 120, size: 40, rot: -5 },
    { x: 960,  y: 100, size: 30, rot: 20 },
    // Bottom-left
    { x: 80,  y: 480, size: 40, rot: -15 },
    { x: 170, y: 550, size: 50, rot: 5 },
    // Bottom-right
    { x: 1080, y: 500, size: 45, rot: -10 },
    { x: 1150, y: 580, size: 30, rot: 25 },
    // Large decorative — far edges only
    { x: -20,  y: 310, size: 100, rot: 15 },
    { x: 1230, y: 280, size: 90,  rot: -10 },
  ];

  positions.forEach((p, i) => {
    const opacity = 0.12 + rand() * 0.15;
    const color = i % 2 === 0 ? c1 : c2;
    svg += `<g transform="translate(${p.x}, ${p.y}) rotate(${p.rot})" opacity="${opacity}">
      <polygon points="${hexPoints(p.size)}" fill="none" stroke="${color}" stroke-width="1.5"/>
    </g>`;
    // Soft glow behind larger hexagons
    if (p.size > 40) {
      svg += `<g transform="translate(${p.x}, ${p.y}) rotate(${p.rot})" opacity="${opacity * 0.3}">
        <polygon points="${hexPoints(p.size * 1.15)}" fill="none" stroke="${color}" stroke-width="3" filter="url(#glow)"/>
      </g>`;
    }
  });

  return svg;
}

function generateWaves(c1, c2, seed) {
  const rand = seededRandom(seed);
  let svg = '';

  // Smooth flowing curves — spaced evenly, subtle
  const curves = [
    { y: 80,  amp: 25, color: c1 },
    { y: 170, amp: 35, color: c2 },
    { y: 320, amp: 20, color: c1 },
    { y: 460, amp: 30, color: c2 },
    { y: 560, amp: 25, color: c1 },
  ];

  curves.forEach((curve, i) => {
    const { y, amp, color } = curve;
    const phase = i * 80;
    svg += `<path d="M-20,${y} C200,${y - amp} 400,${y + amp} 600,${y} C800,${y - amp * 0.7} 1000,${y + amp * 0.5} 1220,${y - amp * 0.3}"
      fill="none" stroke="${color}" stroke-width="1.2" opacity="0.15"/>`;
    // Glow duplicate
    svg += `<path d="M-20,${y} C200,${y - amp} 400,${y + amp} 600,${y} C800,${y - amp * 0.7} 1000,${y + amp * 0.5} 1220,${y - amp * 0.3}"
      fill="none" stroke="${color}" stroke-width="4" opacity="0.04" filter="url(#glow)"/>`;
  });

  // Sparse dot grid — only corners, not center
  for (let x = 30; x < 280; x += 45) {
    for (let y = 30; y < 220; y += 45) {
      svg += `<circle cx="${x}" cy="${y}" r="1.5" fill="${c1}" opacity="0.12"/>`;
    }
  }
  for (let x = 920; x < 1180; x += 45) {
    for (let y = 410; y < 620; y += 45) {
      svg += `<circle cx="${x}" cy="${y}" r="1.5" fill="${c2}" opacity="0.12"/>`;
    }
  }

  return svg;
}

function generateNetwork(c1, c2, seed) {
  const rand = seededRandom(seed);
  // Place nodes only at edges, avoid center text area (300-900 x, 150-480 y)
  const edgeZones = [
    { xMin: 20,  xMax: 280, yMin: 20,  yMax: 620 },  // left
    { xMin: 920, xMax: 1180, yMin: 20,  yMax: 620 },  // right
    { xMin: 280, xMax: 920,  yMin: 20,  yMax: 130 },  // top-center
    { xMin: 280, xMax: 920,  yMin: 500, yMax: 620 },  // bottom-center
  ];

  const nodes = [];
  edgeZones.forEach(zone => {
    const count = 4 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: zone.xMin + rand() * (zone.xMax - zone.xMin),
        y: zone.yMin + rand() * (zone.yMax - zone.yMin),
      });
    }
  });

  let svg = '';
  // Lines between nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (dist < 220) {
        const opacity = (1 - dist / 220) * 0.18;
        svg += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}"
          stroke="${c1}" stroke-width="0.8" opacity="${opacity}"/>`;
      }
    }
  }
  // Nodes — dots with visible glow
  nodes.forEach((n, i) => {
    const size = 2.5 + rand() * 3;
    const color = i % 2 === 0 ? c1 : c2;
    svg += `<circle cx="${n.x}" cy="${n.y}" r="${size}" fill="${color}" opacity="0.30"/>`;
    svg += `<circle cx="${n.x}" cy="${n.y}" r="${size * 4}" fill="${color}" opacity="0.05"/>`;
    svg += `<circle cx="${n.x}" cy="${n.y}" r="${size * 2}" fill="${color}" opacity="0.06" filter="url(#glow)"/>`;
  });

  return svg;
}

function generateDiagonals(c1, c2, seed) {
  const rand = seededRandom(seed);
  let svg = '';

  // Evenly-spaced diagonal lines across full canvas
  for (let i = 0; i < 8; i++) {
    const x = -100 + i * 190;
    const opacity = 0.06 + (i % 3) * 0.04;
    const color = i % 2 === 0 ? c1 : c2;
    svg += `<line x1="${x}" y1="0" x2="${x + 630}" y2="630" stroke="${color}" stroke-width="1" opacity="${opacity}"/>`;
  }

  // Concentric arcs — top-right corner
  for (let r = 80; r < 350; r += 55) {
    const opacity = 0.05 + (350 - r) / 3000;
    svg += `<path d="M${1200 - r},0 A${r},${r} 0 0,1 1200,${r}" fill="none" stroke="${c1}" stroke-width="1" opacity="${opacity}"/>`;
  }

  // Concentric arcs — bottom-left corner
  for (let r = 60; r < 250; r += 50) {
    const opacity = 0.05 + (250 - r) / 2500;
    svg += `<path d="M${r},630 A${r},${r} 0 0,1 0,${630 - r}" fill="none" stroke="${c2}" stroke-width="0.8" opacity="${opacity}"/>`;
  }

  return svg;
}

function generateAbstractions(variation, c1, c2, postId) {
  const seed = postId * 7919; // deterministic per post
  switch (variation) {
    case 'hexagons': return generateHexagons(c1, c2, seed);
    case 'waves': return generateWaves(c1, c2, seed);
    case 'network': return generateNetwork(c1, c2, seed);
    case 'diagonals': return generateDiagonals(c1, c2, seed);
    default: return '';
  }
}

function generateHTML(post) {
  const [c1, c2] = categoryColors[post.category];
  const abstractions = generateAbstractions(post.variation, c1, c2, post.id);
  const bgImageCSS = post.bgImage
    ? `background-image: url("${post.bgImage}"); background-size: cover; background-position: center;`
    : '';
  const localLogoPath = post.localLogo
    ? path.join(rootDir, 'public', post.localLogo)
    : null;
  let logoDataUrl = null;
  if (localLogoPath && fs.existsSync(localLogoPath)) {
    const ext = path.extname(localLogoPath).toLowerCase();
    const mime = ext === '.svg' ? 'image/svg+xml' : 'image/png';
    logoDataUrl = `data:${mime};base64,${fs.readFileSync(localLogoPath).toString('base64')}`;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      background: #0a0e1a;
      position: relative;
    }
    .bg-photo {
      position: absolute;
      inset: 0;
      ${bgImageCSS}
      opacity: 0.07;
      filter: grayscale(60%) brightness(0.8);
    }
    .bg-logo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 420px;
      height: 420px;
      opacity: 0.12;
      z-index: 1;
    }
    .bg-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .bg-gradient {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 600px 400px at 25% 35%, ${c1}25, transparent),
        radial-gradient(ellipse 500px 350px at 80% 65%, ${c2}20, transparent);
    }
    .noise {
      position: absolute;
      inset: 0;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
    .abstractions {
      position: absolute;
      inset: 0;
    }
    .content {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 100px;
      z-index: 10;
    }
    .category {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      background: linear-gradient(135deg, ${c1}, ${c2});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 28px;
    }
    .title {
      font-size: 56px;
      font-weight: 700;
      color: white;
      text-align: center;
      line-height: 1.15;
      max-width: 1000px;
      text-shadow: 0 2px 40px rgba(0,0,0,0.5);
    }
    .divider {
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, ${c1}, ${c2});
      border-radius: 2px;
      margin-top: 32px;
    }
    .brand {
      position: absolute;
      bottom: 30px;
      right: 40px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(255,255,255,0.30);
      letter-spacing: 0.08em;
    }
    .corner-tl, .corner-br {
      position: absolute;
      width: 40px;
      height: 40px;
    }
    .corner-tl {
      top: 25px; left: 25px;
      border-top: 2px solid ${c1}30;
      border-left: 2px solid ${c1}30;
    }
    .corner-br {
      bottom: 25px; right: 25px;
      border-bottom: 2px solid ${c2}30;
      border-right: 2px solid ${c2}30;
    }
  </style>
</head>
<body>
  <div class="bg-photo"></div>
  ${logoDataUrl ? `<div class="bg-logo"><img src="${logoDataUrl}" /></div>` : ''}
  <div class="bg-gradient"></div>
  <div class="noise"></div>
  <svg class="abstractions" width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${abstractions}
  </svg>
  <div class="corner-tl"></div>
  <div class="corner-br"></div>
  <div class="content">
    <div class="category">${post.category}</div>
    <div class="title">${post.coverTitle}</div>
    <div class="divider"></div>
  </div>
  <div class="brand">CLOUDBRIGHT</div>
</body>
</html>`;
}

// --- Main ---
const targetIds = process.argv.slice(2).map(Number);
const toGenerate = targetIds.length > 0
  ? posts.filter(p => targetIds.includes(p.id))
  : posts;

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

for (const post of toGenerate) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

  const html = generateHTML(post);
  const tmpPath = path.join(outputDir, `_tmp_${post.id}.html`);
  fs.writeFileSync(tmpPath, html);

  await page.goto(`file://${tmpPath}`, { waitUntil: 'networkidle0' });

  const filename = `${post.slug}.png`;
  const outPath = path.join(outputDir, filename);
  await page.screenshot({
    path: outPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 630 }
  });

  fs.unlinkSync(tmpPath);
  await page.close();
  console.log(`✓ ${filename}  →  /blog/${filename}`);
}

await browser.close();
console.log(`\nDone! Generated ${toGenerate.length} cover(s) in ${outputDir}`);
