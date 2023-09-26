import { BinanceBookTickers } from "../types";
import config from "../config";


if (!config.binanceApiKey || !config.binanceApiSecret) {
  throw new Error('Please set BINANCE_API_KEY and BINANCE_API_SECRET in .env file');
}

const Binance = require('binance-api-node').default;
const binance = Binance({
  apiKey: config.binanceApiKey,
  apiSecret: config.binanceApiSecret,
  getTime: Date.now
});

let tickers: BinanceBookTickers | undefined;

export default {
  async getTickers() {
    if (tickers) {
      return tickers;
    }

    tickers = await binance.allBookTickers() as unknown as BinanceBookTickers;

    return tickers;
  },

  clearTickers() {
    tickers = undefined;
  }
}