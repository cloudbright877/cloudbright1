/**
 * PriceService - Singleton WebSocket service for real-time crypto prices
 * 3-tier fallback: Binance WebSocket -> CoinGecko API -> Price Simulation
 */

type PriceListener = (prices: Record<string, number>) => void;

export type PriceSource = 'binance' | 'coingecko' | 'simulated';

interface PriceData {
  price: number;
  timestamp: number;
}

export class PriceService {
  private ws: WebSocket | null = null;
  private prices: Record<string, PriceData> = {};
  private listeners = new Set<PriceListener>();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;

  // Fallback state
  private priceSource: PriceSource = 'simulated';
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private readonly baseReconnectDelay = 5000; // 5s

  // CoinGecko fallback
  private coinGeckoInterval: NodeJS.Timeout | null = null;
  private readonly coinGeckoApiUrl = 'https://api.coingecko.com/api/v3/simple/price';
  private coinGeckoFailures = 0;
  private readonly maxCoinGeckoFailures = 3;

  // Simulation fallback
  private simulationInterval: NodeJS.Timeout | null = null;

  // Debounce
  private notifyDebounceTimeout: NodeJS.Timeout | null = null;
  private readonly notifyDebounceMs = 500;

  // Symbols to track
  private readonly symbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'solusdt'];
  private readonly coinGeckoIds: Record<string, string> = {
    'BTCUSDT': 'bitcoin',
    'ETHUSDT': 'ethereum',
    'BNBUSDT': 'binancecoin',
    'SOLUSDT': 'solana'
  };

  // Price validation constants
  private readonly minPrice = 0;
  private readonly maxPrice = 1_000_000;
  private readonly staleThresholdMs = 10_000; // 10 seconds

  /**
   * Connect to Binance WebSocket
   */
  connect(): void {
    if (typeof window === 'undefined') {
      console.warn('[PriceService] Cannot connect on server-side');
      return;
    }

    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    const streams = this.symbols.map(s => `${s}@ticker`).join('/');
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    console.log('[PriceService] Connecting to Binance WebSocket...');

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('[PriceService] ✅ Connected to Binance WebSocket');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.priceSource = 'binance';

        // Stop fallback mechanisms when Binance is back
        this.stopCoinGecko();
        this.stopSimulation();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const symbol = message.data.s; // e.g., "BTCUSDT"
          const price = parseFloat(message.data.c); // Current price

          // Validate price
          if (!this.validatePrice(price, symbol)) {
            return;
          }

          this.prices[symbol] = {
            price,
            timestamp: Date.now()
          };
          this.notifyListenersDebounced();
        } catch (error) {
          console.error('[PriceService] Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[PriceService] ❌ WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('[PriceService] WebSocket closed');
        this.isConnecting = false;
        this.ws = null;

        // Exponential backoff reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts);
          this.reconnectAttempts++;

          console.log(`[PriceService] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

          this.reconnectTimeout = setTimeout(() => {
            this.connect();
          }, delay);
        } else {
          // Max attempts reached, fall back to CoinGecko
          console.warn('[PriceService] Max reconnect attempts reached, falling back to CoinGecko...');
          this.startCoinGecko();
        }
      };
    } catch (error) {
      console.error('[PriceService] Connection error:', error);
      this.isConnecting = false;

      // Trigger fallback on connection error
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.startCoinGecko();
      }
    }
  }

  /**
   * Start CoinGecko API fallback
   */
  private startCoinGecko(): void {
    if (this.coinGeckoInterval) {
      return; // Already running
    }

    console.log('[PriceService] Starting CoinGecko fallback...');
    this.priceSource = 'coingecko';
    this.coinGeckoFailures = 0;

    // Fetch immediately, then every 30s
    this.fetchCoinGecko();
    this.coinGeckoInterval = setInterval(() => {
      this.fetchCoinGecko();
    }, 30000);
  }

  /**
   * Fetch prices from CoinGecko (batched request)
   */
  private async fetchCoinGecko(): Promise<void> {
    try {
      const ids = Object.values(this.coinGeckoIds).join(',');
      const url = `${this.coinGeckoApiUrl}?ids=${ids}&vs_currencies=usd`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();

      // Map CoinGecko data to our format
      Object.entries(this.coinGeckoIds).forEach(([symbol, coinId]) => {
        const price = data[coinId]?.usd;

        if (price && this.validatePrice(price, symbol)) {
          this.prices[symbol] = {
            price,
            timestamp: Date.now()
          };
        }
      });

      this.coinGeckoFailures = 0;
      this.notifyListenersDebounced();

      console.log('[PriceService] ✅ CoinGecko prices updated');
    } catch (error) {
      console.error('[PriceService] CoinGecko fetch error:', error);
      this.coinGeckoFailures++;

      // If CoinGecko fails too many times, fall back to simulation
      if (this.coinGeckoFailures >= this.maxCoinGeckoFailures) {
        console.warn('[PriceService] CoinGecko failed, falling back to simulation...');
        this.stopCoinGecko();
        this.startSimulation();
      }
    }
  }

  /**
   * Stop CoinGecko fallback
   */
  private stopCoinGecko(): void {
    if (this.coinGeckoInterval) {
      clearInterval(this.coinGeckoInterval);
      this.coinGeckoInterval = null;
      console.log('[PriceService] CoinGecko fallback stopped');
    }
  }

  /**
   * Start price simulation fallback
   */
  private startSimulation(): void {
    if (this.simulationInterval) {
      return; // Already running
    }

    console.log('[PriceService] Starting price simulation fallback...');
    this.priceSource = 'simulated';

    // Initialize with last known prices or defaults
    if (Object.keys(this.prices).length === 0) {
      this.prices = {
        'BTCUSDT': { price: 50000, timestamp: Date.now() },
        'ETHUSDT': { price: 3000, timestamp: Date.now() },
        'BNBUSDT': { price: 400, timestamp: Date.now() },
        'SOLUSDT': { price: 100, timestamp: Date.now() }
      };
    }

    // Random walk every 5 seconds
    this.simulationInterval = setInterval(() => {
      Object.keys(this.prices).forEach(symbol => {
        const current = this.prices[symbol].price;

        // Random walk: ±0.1-0.5%
        const volatility = 0.001 + Math.random() * 0.004; // 0.1-0.5%
        const direction = Math.random() < 0.5 ? -1 : 1;
        const change = current * volatility * direction;
        const newPrice = current + change;

        this.prices[symbol] = {
          price: newPrice,
          timestamp: Date.now()
        };
      });

      this.notifyListenersDebounced();
    }, 5000);
  }

  /**
   * Stop simulation fallback
   */
  private stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      console.log('[PriceService] Simulation fallback stopped');
    }
  }

  /**
   * Validate price
   */
  private validatePrice(price: number, symbol: string): boolean {
    if (price <= this.minPrice || price >= this.maxPrice) {
      console.warn(`[PriceService] Invalid price for ${symbol}: ${price} (must be > ${this.minPrice} and < ${this.maxPrice})`);
      return false;
    }
    return true;
  }

  /**
   * Check if price is stale (> 10 seconds old)
   */
  isPriceStale(symbol: string): boolean {
    const priceData = this.prices[symbol];
    if (!priceData) {
      return true; // No price data = stale
    }

    const age = Date.now() - priceData.timestamp;
    return age > this.staleThresholdMs;
  }

  /**
   * Get current price source
   */
  getPriceSource(): PriceSource {
    return this.priceSource;
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.stopCoinGecko();
    this.stopSimulation();

    console.log('[PriceService] Disconnected');
  }

  /**
   * Get current prices (numeric only, for backward compatibility)
   */
  getPrices(): Record<string, number> {
    const result: Record<string, number> = {};
    Object.entries(this.prices).forEach(([symbol, data]) => {
      result[symbol] = data.price;
    });
    return result;
  }

  /**
   * Subscribe to price updates
   * @returns Unsubscribe function
   */
  subscribe(listener: PriceListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Notify all listeners with current prices (debounced)
   */
  private notifyListenersDebounced(): void {
    // Clear existing timeout
    if (this.notifyDebounceTimeout) {
      clearTimeout(this.notifyDebounceTimeout);
    }

    // Set new timeout
    this.notifyDebounceTimeout = setTimeout(() => {
      const prices = this.getPrices();
      this.listeners.forEach(listener => {
        try {
          listener(prices);
        } catch (error) {
          console.error('[PriceService] Error in listener:', error);
        }
      });
    }, this.notifyDebounceMs);
  }
}

// Singleton instance
export const priceService = new PriceService();
