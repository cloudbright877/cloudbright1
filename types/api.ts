// ============================================================================
// API Types - Unified TypeScript Interfaces for Backend Integration
// ============================================================================
// This file contains all TypeScript interfaces that match the API responses
// Backend should return data in these exact formats

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type BotStatus = 'active' | 'paused';
export type BotRisk = 'low' | 'medium' | 'high';
export type PositionSide = 'LONG' | 'SHORT';
export type MarginType = 'cross' | 'isolated';

// ============================================================================
// PORTFOLIO & DASHBOARD
// ============================================================================

export interface Portfolio {
  totalBalance: number;        // Total account balance in USD
  totalInvested: number;       // Total amount invested in bots
  totalValue: number;          // Current value of all investments
  totalProfit: number;         // Total profit/loss (totalValue - totalInvested)
  totalProfitPercent: number;  // Profit percentage
  availableBalance: number;    // Available balance for new investments
  todayPnL: number;           // Today's profit/loss
}

// ============================================================================
// BOT INTERFACES
// ============================================================================

export interface ActiveBot {
  id: string;
  name: string;
  slug: string;
  risk: BotRisk;
  invested: number;           // Amount invested in this bot
  currentValue: number;       // Current value including profit/loss
  profit: number;             // Total profit/loss (currentValue - invested)
  profitPercent: number;      // Profit percentage
  status: BotStatus;
  winRate: number;            // Win rate percentage (0-100)
  trades: number;             // Total number of trades
  todayPnL: number;          // Today's profit/loss
  lastTrade: string;         // Human-readable time (e.g., "5 min ago")
  openPositions: OpenPosition[];
  maxPositions?: number;     // Maximum concurrent positions allowed
}

export interface BotDetails {
  id: string;
  name: string;
  slug: string;
  icon?: string;              // Bot icon path (e.g., "/bots/BybitMarketMakerBot.png")
  status: BotStatus;
  strategy: string;           // e.g., "Grid Trading", "DCA", "Scalping"
  risk: BotRisk;
  invested: number;           // Initial investment
  currentValue: number;       // Current portfolio value
  profit: number;             // Total profit/loss
  profitPercent: number;      // P&L percentage
  todayPnL: number;           // Today's P&L
  todayPnLPercent: number;    // Today's P&L percentage
  tradingPairs: string[];     // Active trading pairs (e.g., ["BTC/USDT", "ETH/USDT"])
  maxPositions: number;       // Max concurrent positions
  activePositions: number;    // Current open positions count
  runningSince: string;       // ISO date string (e.g., "2025-01-15")
  runningDays: number;        // Days since bot started
}

export interface BotStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;            // Percentage (0-100)
  averageWin: number;         // Average profit per winning trade
  averageLoss: number;        // Average loss per losing trade (negative)
  profitFactor: number;       // Total wins / Total losses
  sharpeRatio: number;        // Risk-adjusted return
  maxDrawdown: number;        // Max drawdown percentage (negative)
  totalVolume: number;        // Total trading volume in USD
  averageHoldTime: string;    // e.g., "4.2h"
  bestTrade: number;          // Largest win
  worstTrade: number;         // Largest loss (negative)
  winStreak: number;          // Max consecutive wins
  recoveryFactor: number;     // Total P&L / Max Drawdown
  avgTradeSize: number;       // Average trade size in USD
}

// ============================================================================
// POSITION INTERFACES
// ============================================================================

export interface OpenPosition {
  id: string;
  pair: string;              // Trading pair (e.g., "BTC/USDT")
  side: PositionSide;        // 'long' or 'short'
  leverage: number;          // Leverage multiplier (e.g., 3)
  entryPrice: number;        // Entry price
  currentPrice: number;      // Current market price
  amount: number;            // Position size in base asset
  positionSize: number;      // Position value in USD
  pnl: number;              // Profit/Loss in USD
  pnlPercent: number;       // P&L percentage
  stopLoss: number;         // Stop loss price
  takeProfit: number;       // Take profit price
  openedAt: string;         // Human-readable time (e.g., "5 min ago")
  duration: string;         // Position duration (e.g., "2h 15m")
}

export interface ClosedPosition {
  id: string;
  botName: string;
  pair: string;              // Trading pair (e.g., "BTC/USDT")
  side: PositionSide;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  amount: number;            // Position size in base asset
  positionSize: number;      // Position value in USD
  pnl: number;              // Profit/Loss in USD
  pnlPercent: number;       // P&L percentage
  duration: string;         // Position duration (e.g., "2h 15m")
  closedAt: string;         // Human-readable time (e.g., "2 min ago")
}

export interface Trade {
  id: string;
  botName: string;
  pair: string;              // Trading pair (e.g., "BTC/USDT")
  side: PositionSide;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  amount: number;
  positionSize: number;      // Position value in USD
  pnl: number;              // Realized profit/loss
  pnlPercent: number;       // ROE percentage
  duration: string;         // Hold time (e.g., "4h 20m")
  closedAt: string;         // ISO date string or human-readable
}

// ============================================================================
// CHART DATA
// ============================================================================

export interface EquityPoint {
  timestamp: number;         // Unix timestamp in milliseconds
  value: number;            // Portfolio value at this point
}

export interface PerformanceData {
  labels: string[];         // X-axis labels (dates)
  values: number[];         // Y-axis values (portfolio value)
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface DashboardResponse {
  success: boolean;
  data: {
    portfolio: Portfolio;
    activeBots: ActiveBot[];
    closedPositions: ClosedPosition[];  // Last 12 closed positions
  };
}

export interface BotDetailsResponse {
  success: boolean;
  data: {
    bot: BotDetails;
    stats: BotStats;
    openPositions: OpenPosition[];
    tradeHistory: Trade[];
    equityData: EquityPoint[];
  };
}

export interface TogglePauseResponse {
  success: boolean;
  data: {
    botId: string;
    status: BotStatus;
  };
  message: string;
}

export interface AddFundsResponse {
  success: boolean;
  data: {
    botId: string;
    previousInvested: number;
    newInvested: number;
    addedAmount: number;
  };
  message: string;
}

export interface UpdateSettingsResponse {
  success: boolean;
  data: {
    botId: string;
    settings: {
      stopLoss: number;
      takeProfit: number;
      maxPositions: number;
    };
  };
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// ============================================================================
// REQUEST BODIES
// ============================================================================

export interface AddFundsRequest {
  amount: number;
}

export interface UpdateSettingsRequest {
  stopLoss?: number;        // Percentage (5-30)
  takeProfit?: number;      // Percentage (10-50)
  maxPositions?: number;    // Number of positions (1-10)
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface AnalyticsTrade extends Trade {
  date: string;             // Human-readable date
}

export interface AnalyticsData {
  portfolio: Portfolio;
  performance: PerformanceData;
  bestTrades: AnalyticsTrade[];
  worstTrades: AnalyticsTrade[];
  assetDistribution: {
    labels: string[];       // Asset names (e.g., ["BTC", "ETH"])
    values: number[];       // Percentages
  };
  monthlyStats: {
    month: string;
    profit: number;
    profitPercent: number;
    trades: number;
    winRate: number;
  }[];
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

// ============================================================================
// MASTER BOT (Copy Trading Marketplace)
// ============================================================================

/**
 * Master Bot Data - for public bot marketplace page (/bots/[slug])
 * This represents the MASTER bot that everyone copies
 * All copiers see the same statistics from this master account
 */
export interface MasterBotData {
  // Basic Info
  id: string;              // Master bot unique ID
  slug: string;            // URL slug (e.g., "alphabot", "grid-bot")
  name: string;            // Bot name
  icon: string;            // Bot icon/avatar
  strategy: string;        // Trading strategy (e.g., "Grid Trading", "Scalping")
  description: string;     // Short description
  risk: BotRisk;           // Risk level
  verified: boolean;       // Verification status
  ageMonths: number;       // Bot age in months

  // Aggregate Statistics (all copiers combined)
  totalCopiers: number;           // Total number of people copying this bot
  totalInvestedByAll: number;     // Sum of all investments across all copiers
  totalValueByAll: number;        // Current total value across all copiers
  aggregateProfit: number;        // Total profit of all copiers combined
  aggregateProfitPercent: number; // Aggregate profit percentage
  todayPnL: number;              // Today's P&L (aggregate)

  // Master Account Performance
  stats: BotStats;               // Performance statistics (win rate, sharpe, etc.)
  tradingPairs: string[];        // Active trading pairs (e.g., ["BTC/USDT", "ETH/USDT"])
  maxPositions: number;          // Max concurrent positions
  activePositions: number;       // Current number of open positions
  runningSince: string;          // ISO date when bot started
  runningDays: number;           // Days since bot started

  // Current Trading State
  openPositions: OpenPosition[]; // Currently open positions (all copiers mirror these)
  recentTrades: Trade[];         // Last 20-50 closed trades
  equityData: EquityPoint[];     // Equity curve data (last 30-90 days)

  // Additional Info
  minInvestment: number;         // Minimum investment to copy
  rating: number;                // User rating (1-5)
  reviews: number;               // Number of reviews
  tags: string[];                // Tags (e.g., ["BTC", "ETH", "Low Risk"])
}

/**
 * API Response for Master Bot Details
 */
export interface MasterBotResponse {
  success: boolean;
  data: MasterBotData;
}

/**
 * Note: This is different from BotDetailsResponse which is for
 * individual user's copy (/active-bots/[botId])
 */

// ============================================================================
// MARKETPLACE BOT LIST (Simplified for list views)
// ============================================================================

/**
 * Simplified bot data structure for marketplace list view
 * Used in GET /api/marketplace/bots
 */
export interface BotListItem {
  id: number;
  slug: string;            // URL-friendly identifier (e.g., "alphabot", "protrader")
  name: string;
  icon: string;
  risk: BotRisk;
  strategy: string;
  description: string;
  stats: {
    return7d: number;
    return30d: number;
    return90d: number;
    return1y: number;
    winRate: number;
    maxDD: number;
    sharpeRatio: number;
    copiers: number;
    rating: number;
    reviews: number;
    minInvestment: number;
  };
  tags: string[];
  trending: boolean;
  verified: boolean;
  ageMonths: number;
  performanceData: number[];  // 30-day performance chart data
}

/**
 * API Response for Marketplace Bot List
 */
export interface MarketplaceBotListResponse {
  success: boolean;
  data: {
    bots: BotListItem[];
  };
}
