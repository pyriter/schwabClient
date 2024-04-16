export interface QuotesConfig {
  symbols: string[];
}

export type Quote = {
  assetMainType: string;
  symbol: string;
  quoteType: string;
  realtime: boolean;
  ssid: number;
  reference: {
    cusip: string;
    description: string;
    exchange: string;
    exchangeName: string;
  };
  quote: QuoteIndex;
  regular: {
    regularMarketLastPrice: number;
    regularMarketLastSize: number;
    regularMarketNetChange: number;
    regularMarketPercentChange: number;
    regularMarketTradeTime: number;
  };
  fundamental: {
    avg10DaysVolume: number;
    avg1YearVolume: number;
    divAmount: number;
    divFreq: number;
    divPayAmount: number;
    divYield: number;
    eps: number;
    fundLeverageFactor: number;
    peRatio: number;
  };
};

export type QuoteIndex = {
  '52WeekHigh': number;
  '52WeekLow': number;
  askMICId: string;
  askPrice: number;
  askSize: number;
  askTime: number;
  bidMICId: string;
  bidPrice: number;
  bidSize: number;
  bidTime: number;
  closePrice: number;
  highPrice: number;
  lastMICId: string;
  lastPrice: number;
  lastSize: number;
  lowPrice: number;
  mark: number;
  markChange: number;
  markPercentChange: number;
  netChange: number;
  netPercentChange: number;
  openPrice: number;
  quoteTime: number;
  securityStatus: string;
  totalVolume: number;
  tradeTime: number;
  volatility: number;
};
