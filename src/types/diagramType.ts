interface poolType {
  period: number,
	investment: string,
	returns: string,
	profit: string,
	avgProfit: string,
	bestProfit: string,
	totalClosed: number,
	wlRatio: string, 
	totalBots: number, 
	uptime: number,
} 

export const cryptoYeild12 = {
	period: 90,
	investment: '$10000 - $25000',
	returns: '2.5 - 3.0%',
	profit: '18 245 341 USDT 654%',
	avgProfit: '+2.6%',
	bestProfit: '+3.021%',
	totalClosed: 13245,
	wlRatio: '12156/1154', 
	totalBots: 16, 
	uptime: 132,
} as poolType

export const cryptoMax24 = {
	period: 90,
	investment: '$25000 - $50000',
	returns: '3.0 - 3.6%',
	profit: '48 143 211 USDT 854%',
	avgProfit: '+3.2%',
	bestProfit: '+3.564%',
	totalClosed: 13245,
	wlRatio: '12156/1154', 
	totalBots: 34, 
	uptime: 115,
} as poolType

export const cryptoPro36 = {
	period: 90,
	investment: '$50000 - $250000',
	returns: '3.6 - 4.0%',
	profit: '48 143 211 USDT 854%',
	avgProfit: '+3.2%',
	bestProfit: '+3.564%',
	totalClosed: 13245,
	wlRatio: '12156/1154', 
	totalBots: 34, 
	uptime: 115,
} as poolType