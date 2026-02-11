/* Exchange logos for the marquee section — uses SVGs from /public/exchanges/ */

interface ExchangeLogoProps {
  className?: string;
}

function ExchangeLogo({ src, name, className = '' }: ExchangeLogoProps & { src: string; name: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src={src} alt={name} className="h-5 w-5 shrink-0 object-contain" />
      <span className="text-[13px] font-bold tracking-[0.15em] uppercase">{name}</span>
    </div>
  );
}

export function BinanceLogo({ className }: ExchangeLogoProps) {
  return <ExchangeLogo src="/exchanges/binance-svgrepo-com.svg" name="Binance" className={className} />;
}
export function BybitLogo({ className }: ExchangeLogoProps) {
  return <ExchangeLogo src="/exchanges/bybit-svgrepo-com.svg" name="Bybit" className={className} />;
}
export function OKXLogo({ className }: ExchangeLogoProps) {
  return <ExchangeLogo src="/exchanges/okx-logo.svg" name="OKX" className={className} />;
}
export function BitfinexLogo({ className }: ExchangeLogoProps) {
  return <ExchangeLogo src="/exchanges/bitfinex-v2-svgrepo-com.svg" name="Bitfinex" className={className} />;
}
export function KrakenLogo({ className }: ExchangeLogoProps) {
  return <ExchangeLogo src="/exchanges/kraken-svgrepo-com.svg" name="Kraken" className={className} />;
}
export function KuCoinLogo({ className }: ExchangeLogoProps) {
  return <ExchangeLogo src="/exchanges/kucoin-svgrepo-com.svg" name="KuCoin" className={className} />;
}
export function CoinbaseLogo({ className }: ExchangeLogoProps) {
  return <ExchangeLogo src="/exchanges/coinbase-v2-svgrepo-com.svg" name="Coinbase" className={className} />;
}
export function HTXLogo({ className }: ExchangeLogoProps) {
  return <ExchangeLogo src="/exchanges/htx-token-ht-logo.svg" name="HTX" className={className} />;
}
export function GateLogo({ className }: ExchangeLogoProps) {
  return <ExchangeLogo src="/exchanges/gate.io-icon-logo-brandlogos.net_y1tp1avic.svg" name="Gate.io" className={className} />;
}
export function CryptoComLogo({ className }: ExchangeLogoProps) {
  return <ExchangeLogo src="/exchanges/crypto-svgrepo-com.svg" name="Crypto.com" className={className} />;
}

/* ── All logos for marquee ── */
export const exchangeLogos = [
  { key: 'binance', Component: BinanceLogo },
  { key: 'bybit', Component: BybitLogo },
  { key: 'okx', Component: OKXLogo },
  { key: 'bitfinex', Component: BitfinexLogo },
  { key: 'kraken', Component: KrakenLogo },
  { key: 'kucoin', Component: KuCoinLogo },
  { key: 'coinbase', Component: CoinbaseLogo },
  { key: 'htx', Component: HTXLogo },
  { key: 'gate', Component: GateLogo },
  { key: 'crypto-com', Component: CryptoComLogo },
];
