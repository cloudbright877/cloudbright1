/**
 * PriceService - Singleton WebSocket service for real-time crypto prices
 * Connects to Binance WebSocket and broadcasts prices to all subscribers
 */

type PriceListener = (prices: Record<string, number>) => void;

export class PriceService {
  private ws: WebSocket | null = null;
  private prices: Record<string, number> = {};
  private listeners = new Set<PriceListener>();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private restFallbackInterval: NodeJS.Timeout | null = null;
  private usingRestFallback = false;

  // Symbols to track
  private readonly symbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'solusdt'];

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
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const symbol = message.data.s; // e.g., "BTCUSDT"
          const price = parseFloat(message.data.c); // Current price

          this.prices[symbol] = price;
          this.notifyListeners();
        } catch (error) {
          console.error('[PriceService] Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[PriceService] ❌ WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('[PriceService] WebSocket closed, reconnecting in 5s...');
        this.isConnecting = false;
        this.ws = null;

        // Auto-reconnect
        this.reconnectTimeout = setTimeout(() => {
          this.connect();
        }, 5000);
      };
    } catch (error) {
      console.error('[PriceService] Connection error:', error);
      this.isConnecting = false;
    }
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

    console.log('[PriceService] Disconnected');
  }

  /**
   * Get current prices
   */
  getPrices(): Record<string, number> {
    return { ...this.prices };
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
   * Notify all listeners with current prices
   */
  private notifyListeners(): void {
    const prices = this.getPrices();
    this.listeners.forEach(listener => {
      try {
        listener(prices);
      } catch (error) {
        console.error('[PriceService] Error in listener:', error);
      }
    });
  }
}

// Singleton instance
export const priceService = new PriceService();
