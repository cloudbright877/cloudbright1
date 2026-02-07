// Run in browser console to force update bot config
const newConfig = {
  dailyTargetPercent: 2.5,
  tradesPerDay: 250,
  winRate: 0.75,
  leverages: [2, 2, 3]
};

// Get current configs
const configs = JSON.parse(localStorage.getItem('master_bots_config') || '[]');

// Update or add Bybit Market Maker config
const existingIndex = configs.findIndex(c => c.botId === 'bybit-market-maker');
if (existingIndex >= 0) {
  configs[existingIndex] = {
    botId: 'bybit-market-maker',
    config: { ...configs[existingIndex].config, ...newConfig },
    updatedAt: Date.now()
  };
} else {
  configs.push({
    botId: 'bybit-market-maker',
    config: newConfig,
    updatedAt: Date.now()
  });
}

// Save back
localStorage.setItem('master_bots_config', JSON.stringify(configs));

console.log('✅ Config updated! Reload page to apply.');
