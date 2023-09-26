export interface Profitability {
  symbol: string;
  profitability: number;
}

export interface Rate {
  symbol: string;
  bid: number;
  ask: number;
}

export interface Ticker {
  symbol: string,
  bidPrice: string,
  bidQty: string,
  askPrice: string,
  askQty: string,
}

export type BinanceBookTickers = { [key: string]: Ticker };

export interface Order {
  type: 'buy' | 'sell';
  pair: string;
  price: number;
}

export interface Opportunity {
  coins: string[];
  profit: number;
  orders: Order[];
}