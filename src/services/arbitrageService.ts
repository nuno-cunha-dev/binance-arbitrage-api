import * as mathjs from 'mathjs';
import tickerService from "./tickerService";
import { BinanceBookTickers, Opportunity, Profitability, Rate } from "../types";
import config from "../config";

async function getAltCoins(tickers: BinanceBookTickers, stableCoin: string, highVolumeCoin: string): Promise<string[]> {
  const altCoins = [];
  const pricesKeys = Object.keys(tickers);
  for (let i = 0; i < pricesKeys.length; i++) {
    const coin = pricesKeys[i];
    if (coin.endsWith(stableCoin)) {
      const reversedCoinPair = coin.replace(stableCoin, highVolumeCoin);
      if (tickers[reversedCoinPair]) {
        altCoins.push(coin.replace(stableCoin, ''));
      }
    }
  }

  return altCoins;
}

async function getRates(tickers: BinanceBookTickers, symbol: string): Promise<Rate> {
  const ticker = tickers[symbol];
  return {
    symbol,
    bid: parseFloat(ticker.bidPrice),
    ask: parseFloat(ticker.askPrice),
  }
}

async function checkTriArb(tickers: BinanceBookTickers, stableToken: string, highVolumeToken: string, lowVolumeToken: string): Promise<Opportunity | undefined> {
  const rateAB = await getRates(tickers, highVolumeToken + stableToken);
  const rateBC = await getRates(tickers, lowVolumeToken + highVolumeToken);
  const rateCA = await getRates(tickers, lowVolumeToken + stableToken);

  if (!rateAB.ask || !rateAB.bid || !rateBC.ask || !rateBC.bid || !rateCA.ask || !rateCA.bid) {
    return;
  }

  const profitability = (100 / rateCA.ask) * rateBC.bid * rateAB.bid;
  const backwardsProfitability = (100 / rateAB.ask) / rateBC.ask * rateCA.bid;

  if (profitability > backwardsProfitability) {
    return {
      coins: [stableToken, lowVolumeToken, highVolumeToken],
      profit: profitability - 100,
      orders: [
        {
          type: 'buy',
          pair: `${lowVolumeToken} / ${stableToken}`,
          price: rateCA.ask,
        },
        {
          type: 'buy',
          pair: `${lowVolumeToken} / ${highVolumeToken}`,
          price: rateBC.ask,
        },
        {
          type: 'sell',
          pair: `${highVolumeToken} / ${stableToken}`,
          price: rateAB.bid,
        }
      ]
    }
  }

  return {
    coins: [stableToken, highVolumeToken, lowVolumeToken],
    profit: backwardsProfitability - 100,
    orders: [
      {
        type: 'buy',
        pair: `${highVolumeToken} / ${stableToken}`,
        price: rateAB.ask,
      },
      {
        type: 'sell',
        pair: `${lowVolumeToken} / ${highVolumeToken}`,
        price: rateBC.bid,
      },
      {
        type: 'sell',
        pair: `${lowVolumeToken} / ${stableToken}`,
        price: rateCA.bid,
      }
    ],
  }
}

export default {
  async getProfitableArbitrages(): Promise<Opportunity[]> {
    const stableCoin = config.stableCoin;
    const highVolumeCoin = config.highVolumeCoin;

    const tickers = await tickerService.getTickers();
    const altCoins = await getAltCoins(tickers, stableCoin, highVolumeCoin);

    const opportunities: Opportunity[] = [];
    for (let i = 0; i < altCoins.length; i++) {
      const coin = altCoins[i];
      if (coin !== stableCoin && coin !== highVolumeCoin) {
        const arb = await checkTriArb(tickers, stableCoin, highVolumeCoin, coin);
        if (arb && arb.profit > 0) {
          arb.profit = mathjs.round(arb.profit, 4)
          opportunities.push(arb);
        }
      }
    }

    tickerService.clearTickers();
    return opportunities;
  }
}


