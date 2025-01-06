import { SchwabClient } from './schwabClient';
import { OptionChainConfig } from '../models/optionChain';
import { HoursConfig } from '../models/hours';
import {
  provideSchwabClientWithLocalCacheProvider,
  provideSchwabClientWithLocalFileProvider,
} from '../utils/testUtils';
import { GetTransactionsConfig } from '../models/transaction';
import { DateTime } from 'luxon';

describe('SchwabClient', () => {
  describe('Instantiate with local cache', () => {
    let schwabClient: SchwabClient;
    beforeAll(async () => {
      schwabClient = await provideSchwabClientWithLocalCacheProvider();
    });

    it('should be able to get account information', async () => {
      const account = (await schwabClient.getAllAccounts()).pop();

      expect(account).toBeDefined();
      expect(account?.accountNumber).toBeDefined();
    });

    it('should be able to get options chain', async () => {
      const response = await schwabClient.getOptionChain({
        symbol: 'SPY',
        strike: 470,
        strikeCount: 10,
      } as OptionChainConfig);

      expect(response.symbol).toBe('SPY');
      expect(response.status).toBe('SUCCESS');
    });

    it('should be able to market hours', async () => {
      const response = await schwabClient.getHours({
        markets: ['EQUITY', 'OPTION'],
      } as HoursConfig);

      const expectedEquity = response.equity?.EQ || response.equity?.equity;
      const expectedOption = response.option?.EQO || response.option?.option;
      expect(expectedEquity?.marketType).toBe('EQUITY');
      expect(expectedOption?.marketType).toBe('OPTION');
    });
  });

  describe('Instantiate with locale file credential provider', () => {
    let schwabClient: SchwabClient;
    beforeAll(async () => {
      schwabClient = await provideSchwabClientWithLocalFileProvider();
    });

    it('should be able to get account information', async () => {
      const accounts = await schwabClient.getAllAccounts();
      const account = accounts.pop();

      expect(account).toBeDefined();
      expect(account?.accountNumber).toBeDefined();
    });

    it('should be able to get options chain', async () => {
      const response = await schwabClient.getOptionChain({
        symbol: 'SPY',
        strike: 470,
        strikeCount: 10,
      } as OptionChainConfig);

      expect(response.symbol).toBe('SPY');
      expect(response.status).toBe('SUCCESS');
    });

    it('should be able to market hours', async () => {
      const response = await schwabClient.getHours({
        markets: ['EQUITY', 'OPTION'],
      } as HoursConfig);

      const expectedEquity = response.equity?.EQ || response.equity?.equity;
      const expectedOption = response.option?.EQO || response.option?.option;
      expect(expectedEquity?.marketType).toBe('EQUITY');
      expect(expectedOption?.marketType).toBe('OPTION');
    });

    it('should be able to get transactions given a day', async () => {
      const accounts = (await schwabClient.getAllAccounts()) || [];
      const account = accounts.pop();
      const response = await schwabClient.getTransactions({
        accountId: account?.hashValue || '',
        startDate: DateTime.now().minus({ day: 5 }).toISO(),
        endDate: DateTime.now().toISO(),
      });

      expect(response).toBeDefined();
    });
  });
});
