/**
 * Master Bots Configuration Manager
 *
 * Purpose: Persist admin changes to master bot configs in localStorage
 * so they survive page refreshes and apply to newly created bot instances.
 */

import type { BotConfig } from './trading/types';
import { DEMO_BOTS } from './demoMarketplace';

const MASTER_BOTS_CONFIG_KEY = 'master_bots_config';

export interface MasterBotConfigOverride {
  botId: string;
  config: Partial<BotConfig>;
  updatedAt: number;
}

/**
 * Get all saved master bot config overrides
 */
export function getMasterBotsConfig(): Map<string, Partial<BotConfig>> {
  if (typeof window === 'undefined') return new Map();

  try {
    const data = localStorage.getItem(MASTER_BOTS_CONFIG_KEY);
    if (!data) return new Map();

    const overrides: MasterBotConfigOverride[] = JSON.parse(data);
    const map = new Map<string, Partial<BotConfig>>();

    overrides.forEach(override => {
      map.set(override.botId, override.config);
    });

    return map;
  } catch (error) {
    console.error('[MasterBotsConfig] Error loading config:', error);
    return new Map();
  }
}

/**
 * Save master bot config override
 */
export function saveMasterBotConfig(botId: string, config: Partial<BotConfig>): void {
  if (typeof window === 'undefined') return;

  try {
    const configMap = getMasterBotsConfig();
    configMap.set(botId, config);

    const overrides: MasterBotConfigOverride[] = Array.from(configMap.entries()).map(([id, cfg]) => ({
      botId: id,
      config: cfg,
      updatedAt: Date.now(),
    }));

    localStorage.setItem(MASTER_BOTS_CONFIG_KEY, JSON.stringify(overrides));
    console.log(`[MasterBotsConfig] Saved config for ${botId}`);
  } catch (error) {
    console.error('[MasterBotsConfig] Error saving config:', error);
  }
}

/**
 * Get merged config for a master bot (default + overrides)
 */
export function getMergedBotConfig(botId: string): BotConfig | null {
  const demoBot = DEMO_BOTS.find(b => b.id === botId);
  if (!demoBot) return null;

  const overrides = getMasterBotsConfig();
  const override = overrides.get(botId);

  if (!override) {
    return demoBot.config;
  }

  return {
    ...demoBot.config,
    ...override,
  };
}

/**
 * Clear config override for a bot (reset to default)
 */
export function clearMasterBotConfig(botId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const configMap = getMasterBotsConfig();
    configMap.delete(botId);

    const overrides: MasterBotConfigOverride[] = Array.from(configMap.entries()).map(([id, cfg]) => ({
      botId: id,
      config: cfg,
      updatedAt: Date.now(),
    }));

    localStorage.setItem(MASTER_BOTS_CONFIG_KEY, JSON.stringify(overrides));
    console.log(`[MasterBotsConfig] Cleared config for ${botId}`);
  } catch (error) {
    console.error('[MasterBotsConfig] Error clearing config:', error);
  }
}

/**
 * Clear all config overrides
 */
export function clearAllMasterBotsConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MASTER_BOTS_CONFIG_KEY);
  console.log('[MasterBotsConfig] Cleared all configs');
}
