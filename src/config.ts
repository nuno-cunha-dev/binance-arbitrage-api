import process from "process";

export default {
  port: process.env.PORT || 3000,
  binanceApiKey: process.env.BINANCE_API_KEY || '',
  binanceApiSecret: process.env.BINANCE_API_SECRET || '',
  stableCoin: 'USDT',
  highVolumeCoin: 'BTC',
};