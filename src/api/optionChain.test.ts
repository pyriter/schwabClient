import {provideClientWithLocalCacheCredentialProvider} from '../utils/testUtils';
import {OptionChainApi} from './optionChain';
import {ContractType, Month, OptionChainConfig, OptionStrategyType, OptionType} from '../models/optionChain';
import {QuotesApi} from './quotes';
import {Quote} from '../models/quotes';
import {getYYYYMMDD} from "../utils/month";

describe('OptionChain', () => {
  const symbol = 'SPX';
  let optionChainApi: OptionChainApi;
  let quotesApi: QuotesApi;
  let spx: Quote;

  beforeAll(async () => {
    const provider = await provideClientWithLocalCacheCredentialProvider();
    optionChainApi = new OptionChainApi(provider);
    quotesApi = new QuotesApi(provider);
    const quotesResponse = await quotesApi.getQuotes({
      symbols: [symbol],
    });
    spx = quotesResponse[0];
  });

  it('should get options chain given strike', async () => {
    const response = await optionChainApi.getOptionChain({
      symbol,
      strike: spx.quote.closePrice,
      strikeCount: 10,
      optionType: OptionType.ALL,
    } as OptionChainConfig);
    const options = values(values(response.callExpDateMap).pop());

    expect(options.length).toEqual(10);
  });

  it('should get vertical put spreads with a width of 5', async () => {
    const response = await optionChainApi.getOptionChain({
      symbol,
      strike: spx.quote.closePrice - 100,
      strikeCount: 10,
      interval: 5,
      contractType: ContractType.PUT,
      strategy: OptionStrategyType.VERTICAL,
    } as OptionChainConfig);

    expect(response.monthlyStrategyList.pop());
  });

  it('should get vertical put spreads with a width of 5 x', async () => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + 5);
    const toDate = getYYYYMMDD(date);
    const response = await optionChainApi.getOptionChain({
      symbol: 'SPX',
      contractType: ContractType.PUT,
      strategy: OptionStrategyType.SINGLE,
      toDate,
    } as OptionChainConfig);

    expect(response.putExpDateMap).toBeDefined();
  });

  xit('should get put spreads that are at a specific dte and price', async () => {
    const dte = 1;
    const response = await optionChainApi.getOptionChain({
      symbol,
      strikeCount: 20,
      interval: 5,
      contractType: ContractType.PUT,
      strategy: OptionStrategyType.VERTICAL,
      expMonth: Month.JAN,
    } as OptionChainConfig);

    const { monthlyStrategyList } = response;
    const monthlyStrategy = monthlyStrategyList.filter((m) => m.daysToExp == dte).pop();
    const strategy = monthlyStrategy?.optionStrategyList
      .filter((s) => (s.strategyAsk + s.strategyBid) / 2 == 0.25)
      .pop();

    expect(strategy?.strategyBid).toBeTruthy();
    expect(strategy?.strategyAsk).toBeTruthy();
  });
});

function values(object) {
  return Object.values(object);
}
