import { useEffect, useRef, useState } from 'react';

export interface PricePoint {
  price: number;
  timestamp: number;
}

export interface BinancePrices {
  [symbol: string]: {
    price: number;
    priceChange: number;
    priceChangePercent: number;
    lastUpdate: number;
    history: PricePoint[]; // Last 100 price updates for momentum analysis
  };
}

interface BinanceTickerData {
  s: string; // Symbol
  c: string; // Current price
  p: string; // Price change
  P: string; // Price change percent
  E: number; // Event time
}

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'];

/**
 * Analyze momentum: check if price is trending up/down in last N seconds
 * @param history - Price history
 * @param seconds - Time window to analyze (default 15s)
 * @returns { direction: 'up' | 'down' | 'flat', change: number (percent) }
 */
export function analyzeMomentum(
  history: PricePoint[],
  seconds: number = 15
): { direction: 'up' | 'down' | 'flat'; change: number } {
  if (history.length < 2) {
    return { direction: 'flat', change: 0 };
  }

  const now = Date.now();
  const cutoffTime = now - seconds * 1000;

  // Filter points within time window
  const recentPoints = history.filter(p => p.timestamp >= cutoffTime);

  if (recentPoints.length < 2) {
    return { direction: 'flat', change: 0 };
  }

  const firstPrice = recentPoints[0].price;
  const lastPrice = recentPoints[recentPoints.length - 1].price;
  const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;

  // Threshold: 0.01% movement is significant (lowered for testing)
  if (changePercent > 0.01) {
    return { direction: 'up', change: changePercent };
  } else if (changePercent < -0.01) {
    return { direction: 'down', change: changePercent };
  } else {
    return { direction: 'flat', change: changePercent };
  }
}

/**
 * Hook to get real-time prices from Binance WebSocket
 * Automatically reconnects on disconnect
 */
export function useBinancePrices() {
  const [prices, setPrices] = useState<BinancePrices>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      try {
        // Binance WebSocket URL for multiple ticker streams
        const streams = SYMBOLS.map(s => `${s.toLowerCase()}@ticker`).join('/');
        const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

        console.log('🔌 Connecting to Binance WebSocket...');
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (isMounted) {
            console.log('✅ Connected to Binance');
            setIsConnected(true);
            setError(null);
          }
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;

          try {
            const message = JSON.parse(event.data);

            // Binance sends data in { stream: "...", data: {...} } format
            if (message.data) {
              const ticker: BinanceTickerData = message.data;
              const symbol = ticker.s; // e.g., "BTCUSDT"
              const formattedSymbol = symbol.replace('USDT', '/USDT'); // "BTC/USDT"

              setPrices((prev) => {
                const currentPrice = parseFloat(ticker.c);
                const existingData = prev[formattedSymbol];
                const history = existingData?.history || [];

                // Add new price point to history
                const newHistory = [
                  ...history,
                  { price: currentPrice, timestamp: ticker.E }
                ].slice(-100); // Keep last 100 points

                // Log first few price updates for debugging
                if (history.length < 3) {
                  console.log(`💰 ${formattedSymbol}: $${currentPrice.toFixed(2)} (history: ${newHistory.length})`);
                }

                return {
                  ...prev,
                  [formattedSymbol]: {
                    price: currentPrice,
                    priceChange: parseFloat(ticker.p),
                    priceChangePercent: parseFloat(ticker.P),
                    lastUpdate: ticker.E,
                    history: newHistory,
                  },
                };
              });
            }
          } catch (err) {
            console.error('❌ Error parsing Binance message:', err);
          }
        };

        ws.onerror = (event) => {
          console.error('❌ Binance WebSocket error:', event);
          if (isMounted) {
            setError('WebSocket connection error');
          }
        };

        ws.onclose = (event) => {
          console.log('🔌 Binance WebSocket closed:', {
            code: event.code,
            reason: event.reason || 'No reason provided',
            wasClean: event.wasClean
          });
          if (isMounted) {
            setIsConnected(false);

            // Auto-reconnect after 3 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMounted) {
                console.log('🔄 Reconnecting to Binance...');
                connect();
              }
            }, 3000);
          }
        };
      } catch (err) {
        console.error('❌ Failed to connect to Binance:', err);
        if (isMounted) {
          setError('Failed to connect');

          // Retry after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) connect();
          }, 5000);
        }
      }
    };

    connect();

    // Cleanup
    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return { prices, isConnected, error };
}
