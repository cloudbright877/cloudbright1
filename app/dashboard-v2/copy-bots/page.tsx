'use client';

import { useEffect, useState } from 'react';
import { botManager } from '@/lib/BotManager';
import { priceService } from '@/lib/PriceService';
import { generatePresets, getRandomPreset } from '@/lib/presets';
import type { BotStats } from '@/lib/trading/types';

export default function CopyBotsPage() {
  const [stats, setStats] = useState<BotStats[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Load saved bots
    botManager.load();

    // Start auto-pricing
    const unsubscribe = botManager.startAutoPricing(priceService);

    // Update UI every second
    const interval = setInterval(() => {
      setStats(botManager.getAllStats());
      setIsConnected(priceService.isConnected());
    }, 1000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const createBot = () => {
    const config = getRandomPreset();
    botManager.createBot(config);
  };

  const create10Bots = () => {
    const presets = generatePresets();
    presets.forEach(config => {
      botManager.createBot(config);
    });
  };

  const deleteBot = (id: string) => {
    if (confirm('Delete this bot?')) {
      botManager.deleteBot(id);
    }
  };

  const clearAll = () => {
    if (confirm('Delete ALL bots?')) {
      botManager.clearAll();
      setStats([]);
    }
  };

  // Calculate aggregated stats
  const aggStats = botManager.getAggregatedStats();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Copy Trading Bots</h1>
          <p className="text-gray-500 mt-1">
            Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={create10Bots}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 font-medium"
          >
            Create 10 Bots
          </button>
          <button
            onClick={createBot}
            className="px-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg hover:bg-dark-700"
          >
            + Create Bot
          </button>
          {stats.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Aggregated Stats */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
            <div className="text-sm text-gray-500">Total Bots</div>
            <div className="text-xl sm:text-2xl font-medium">{aggStats.totalBots}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
            <div className="text-sm text-gray-500">Total P&L</div>
            <div
              className={`text-xl sm:text-2xl font-medium ${
                aggStats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {aggStats.totalPnL >= 0 ? '+' : ''}${aggStats.totalPnL.toFixed(2)}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
            <div className="text-sm text-gray-500">Avg Win Rate</div>
            <div className="text-xl sm:text-2xl font-medium">{aggStats.avgWinRate.toFixed(1)}%</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
            <div className="text-sm text-gray-500">Positions / Trades</div>
            <div className="text-xl sm:text-2xl font-medium">
              {aggStats.totalPositions} / {aggStats.totalTrades}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <p className="text-gray-500 text-lg mb-4">No bots yet</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={create10Bots}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 font-medium"
            >
              Create 10 Bots
            </button>
            <button
              onClick={createBot}
              className="px-6 py-3 bg-dark-800 border border-dark-700 text-white rounded-lg hover:bg-dark-700"
            >
              Create 1 Bot
            </button>
          </div>
        </div>
      )}

      {/* Bot Grid */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((bot) => (
            <BotCard key={bot.id} bot={bot} onDelete={() => deleteBot(bot.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function BotCard({ bot, onDelete }: { bot: BotStats; onDelete: () => void }) {
  const isProfit = bot.totalPnL >= 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg">{bot.name}</h3>
          <span className="text-xs text-gray-500">{bot.id.slice(0, 12)}...</span>
        </div>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Delete
        </button>
      </div>

      {/* P&L */}
      <div className={`text-2xl sm:text-3xl font-semibold mb-4 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
        {isProfit ? '+' : ''}${bot.totalPnL.toFixed(2)}
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Win Rate:</span>
          <span className="font-medium">{bot.winRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Positions:</span>
          <span className="font-medium">{bot.positions.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Trades:</span>
          <span className="font-medium">
            {bot.tradesCount} ({bot.winsCount}W / {bot.lossesCount}L)
          </span>
        </div>
        {bot.avgWin > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Avg Win:</span>
            <span className="font-medium text-green-500">+${bot.avgWin.toFixed(2)}</span>
          </div>
        )}
        {bot.avgLoss < 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Avg Loss:</span>
            <span className="font-medium text-red-500">${bot.avgLoss.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
