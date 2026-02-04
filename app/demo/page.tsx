import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">🚀 Celestian Dashboard Demo</h1>
        <p className="text-dark-300 mb-8">Choose which version to explore</p>

        {/* v2 Section */}
        <div className="mb-8 p-6 bg-primary-500/10 border border-primary-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-white">Dashboard v2</h2>
            <span className="px-2 py-1 bg-accent-500/20 border border-accent-500/30 rounded text-xs font-bold text-accent-400">
              NEW
            </span>
          </div>
          <p className="text-sm text-dark-300 mb-4">
            Social copy-trading platform with feed, bot discovery, and community features
          </p>

          <div className="space-y-2">
            <Link
              href="/dashboard-v2"
              className="block px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-white hover:shadow-lg transition-all text-center"
            >
              🏠 Feed (Main Dashboard)
            </Link>

            <Link
              href="/dashboard-v2/portfolio"
              className="block px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all text-center"
            >
              💼 My Portfolio (NEW)
            </Link>

            <Link
              href="/dashboard-v2/bots"
              className="block px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all text-center"
            >
              🤖 Browse Bots (6 available)
            </Link>

            <Link
              href="/dashboard-v2/bots/alphabot"
              className="block px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all text-center"
            >
              📊 Bot Detail (AlphaBot Example)
            </Link>

            <Link
              href="/dashboard-v2/traders"
              className="block px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all text-center"
            >
              👥 Browse Traders (NEW)
            </Link>

            <Link
              href="/dashboard-v2/traders/john_pro"
              className="block px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all text-center"
            >
              👤 Trader Profile (John Pro Example)
            </Link>

            <Link
              href="/dashboard-v2/leaderboard"
              className="block px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all text-center"
            >
              🏆 Leaderboard (NEW)
            </Link>

            <Link
              href="/dashboard-v2/whales"
              className="block px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all text-center"
            >
              🐋 Whale Watching (NEW)
            </Link>

            <Link
              href="/dashboard-v2/bots/compare"
              className="block px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all text-center"
            >
              ⚖️ Bot Comparison (NEW)
            </Link>

            <Link
              href="/dashboard-v2/settings"
              className="block px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all text-center"
            >
              ⚙️ Settings (NEW)
            </Link>
          </div>
        </div>

        {/* v1 Section */}
        <div className="p-6 bg-dark-900/50 border border-dark-700 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">Dashboard v1 (Original)</h2>
          <p className="text-sm text-dark-300 mb-4">
            Original copy-trades page with detailed bot analytics
          </p>

          <Link
            href="/copy-trades"
            className="block px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-dark-600 transition-all text-center"
          >
            📈 Copy Trades (Original Detail Page)
          </Link>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-dark-900/50 border border-dark-700 rounded-lg">
          <p className="text-xs text-dark-400">
            💡 <strong>Note:</strong> All data is mocked for prototype demo purposes.
            v2 is built in separate folder to not affect v1.
          </p>
        </div>
      </div>
    </div>
  );
}
