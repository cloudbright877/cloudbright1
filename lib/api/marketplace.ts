// ============================================================================
// MARKETPLACE API SERVICE
// ============================================================================
// This file provides API functions for the marketplace pages
// Currently uses mock data - replace with real API calls when backend is ready

import type { MasterBotResponse, BotListItem } from '@/types/api';
import { getAllMasterBots, getMasterBotBySlug, getBotListItems } from '@/lib/mock/marketplace-data';

// Configuration
const USE_MOCK = true; // Set to false when backend is ready
const API_BASE_URL = '/api/v1'; // Adjust based on your API setup

// Simulated API delay (makes it feel like real API)
const MOCK_DELAY_MS = 300;

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// MARKETPLACE ENDPOINTS
// ============================================================================

/**
 * Get list of all bots for marketplace
 * Endpoint: GET /api/marketplace/bots
 *
 * @returns Promise<BotListItem[]> - Array of simplified bot data for list view
 */
export async function getMarketplaceBots(): Promise<BotListItem[]> {
  if (USE_MOCK) {
    console.log('[MOCK API] Fetching marketplace bots...');
    await delay(MOCK_DELAY_MS);

    const bots = getBotListItems();
    console.log(`[MOCK API] Fetched ${bots.length} bots`);

    return bots;
  }

  // Real API implementation (uncomment when backend is ready)
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/bots`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if needed:
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.bots;
  } catch (error) {
    console.error('[API ERROR] Failed to fetch marketplace bots:', error);
    throw error;
  }
  */

  throw new Error('Real API not implemented yet');
}

/**
 * Get detailed data for a specific master bot
 * Endpoint: GET /api/marketplace/bots/:slug
 *
 * @param slug - Bot slug (e.g., 'alphabot', 'protrader')
 * @returns Promise<MasterBotResponse> - Complete master bot data including stats, positions, trades
 */
export async function getMasterBot(slug: string): Promise<MasterBotResponse> {
  if (USE_MOCK) {
    console.log(`[MOCK API] Fetching master bot: ${slug}...`);
    await delay(MOCK_DELAY_MS);

    const bot = getMasterBotBySlug(slug);

    if (!bot) {
      console.error(`[MOCK API] Bot not found: ${slug}`);
      return {
        success: false,
        data: null as any,
      };
    }

    console.log(`[MOCK API] Successfully fetched bot: ${bot.name}`);

    return {
      success: true,
      data: bot,
    };
  }

  // Real API implementation (uncomment when backend is ready)
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/bots/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if needed:
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          data: null as any,
        };
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: MasterBotResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`[API ERROR] Failed to fetch bot ${slug}:`, error);
    throw error;
  }
  */

  throw new Error('Real API not implemented yet');
}

/**
 * Copy a bot (start following/copying a master bot)
 * Endpoint: POST /api/bots/copy
 *
 * @param botSlug - Bot slug to copy
 * @param amount - Investment amount in USD
 * @returns Promise<{ success: boolean; message: string; botId?: string }>
 */
export async function copyBot(botSlug: string, amount: number): Promise<{
  success: boolean;
  message: string;
  botId?: string;
}> {
  if (USE_MOCK) {
    console.log(`[MOCK API] Copying bot ${botSlug} with $${amount}...`);
    await delay(MOCK_DELAY_MS);

    // Simulate validation
    if (amount < 100) {
      return {
        success: false,
        message: 'Minimum investment is $100',
      };
    }

    console.log(`[MOCK API] Successfully copied bot ${botSlug}`);

    return {
      success: true,
      message: `Successfully started copying ${botSlug}`,
      botId: `bot-${botSlug}-${Date.now()}`,
    };
  }

  // Real API implementation (uncomment when backend is ready)
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/bots/copy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        botSlug,
        amount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.error?.message || 'Failed to copy bot',
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Bot copied successfully',
      botId: data.data?.botId,
    };
  } catch (error) {
    console.error('[API ERROR] Failed to copy bot:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
  */

  throw new Error('Real API not implemented yet');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get auth token from localStorage/cookies
 * TODO: Implement based on your auth strategy
 */
function getAuthToken(): string | null {
  // Example implementations:
  // return localStorage.getItem('auth_token');
  // return Cookies.get('auth_token');
  // return await getSession().then(session => session?.token);

  return null;
}

/**
 * Check if API is in mock mode
 */
export function isUsingMockData(): boolean {
  return USE_MOCK;
}

/**
 * Get API configuration
 */
export function getApiConfig() {
  return {
    useMock: USE_MOCK,
    baseUrl: API_BASE_URL,
    mockDelay: MOCK_DELAY_MS,
  };
}
