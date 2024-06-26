import { Interceptor } from './interceptor';
import { CredentialProvider } from '../providers/credentialProvider';
import { SchwabClientBuilder } from './schwabClientBuilder';
import {
  CancelOrderConfig,
  GetOrderConfig,
  Order,
  OrdersByQueryConfig,
  OrdersConfig,
  PlaceOrderResponse,
  ReplaceOrdersConfig,
} from '../models/order';
import { AuthorizationTokenInterceptor } from './authorizationTokenInterceptor';
import { OptionChainConfig, OptionChainResponse } from '../models/optionChain';
import { QuotesConfig, Quote } from '../models/quotes';
import { AccountConfig, SecuritiesAccount } from '../models/accounts';
import { GetTransactionsByQueryConfig, GetTransactionsConfig, Transaction } from '../models/transaction';
import { Client } from './client';
import { AccountApi } from '../api/accounts';
import { OrdersApi } from '../api/orders';
import { OptionChainApi } from '../api/optionChain';
import { QuotesApi } from '../api/quotes';
import { TransactionsApi } from '../api/transactions';
import { HoursConfig, HoursResponse } from '../models/hours';
import { HoursApi } from '../api/hours';
import { PriceHistoryConfig, PriceHistoryResponse } from '../models/priceHistory';
import { PriceHistoryApi } from '../api/priceHistory';
import { oauth, OAuthData, OAuthResponse } from '../api/authenticate';

export interface SchwabClientConfig {
  authorizationInterceptor: Interceptor;
}

export interface SchwabClientBuilderConfig {
  access_token?: string;
  refresh_token?: string;
  client_id?: string;
  redirect_uri?: string;
  fileName?: string;
  credentialProvider?: CredentialProvider;
  authorizationInterceptor?: AuthorizationTokenInterceptor;
}

export class SchwabClient {
  private accountApi: AccountApi;
  private ordersApi: OrdersApi;
  private optionChainApi: OptionChainApi;
  private quotesApi: QuotesApi;
  private transactionApi: TransactionsApi;
  private hoursApi: HoursApi;
  private priceHistoryApi: PriceHistoryApi;
  private client: Client;

  constructor(private config: SchwabClientConfig) {
    const client = new Client();
    client.addInterceptor(config.authorizationInterceptor);

    this.accountApi = new AccountApi(client);
    this.ordersApi = new OrdersApi(client);
    this.optionChainApi = new OptionChainApi(client);
    this.quotesApi = new QuotesApi(client);
    this.transactionApi = new TransactionsApi(client);
    this.hoursApi = new HoursApi(client);
    this.priceHistoryApi = new PriceHistoryApi(client);
    this.client = client;
  }

  static from(config: SchwabClientBuilderConfig): SchwabClient {
    return new SchwabClientBuilder(config).build();
  }

  async getAllAccounts(): Promise<SecuritiesAccount[]> {
    return await this.accountApi.getAllAccounts();
  }

  async getAccountByNumber(accountNumber: string): Promise<SecuritiesAccount> {
    const accountMetadata = await this.accountApi.getAccountNumbers();
    const target = accountMetadata.find((a) => a.accountNumber === accountNumber);
    if (!target) throw new Error(`Account number ${accountNumber} does not exists`);
    return await this.accountApi.getAccount({
      accountNumberHashValue: target.hashValue,
    });
  }

  async getAccountByHash(accountHashValue: string): Promise<SecuritiesAccount> {
    return await this.accountApi.getAccount({
      accountNumberHashValue: accountHashValue,
    });
  }

  async placeOrder(config: OrdersConfig): Promise<PlaceOrderResponse> {
    return await this.ordersApi.placeOrder(config);
  }

  async replaceOrder(config: ReplaceOrdersConfig): Promise<PlaceOrderResponse> {
    return await this.ordersApi.replaceOrder(config);
  }

  async getOptionChain(config: OptionChainConfig): Promise<OptionChainResponse> {
    return await this.optionChainApi.getOptionChain(config);
  }

  async getQuotes(config: QuotesConfig): Promise<Quote[]> {
    return await this.quotesApi.getQuotes(config);
  }

  async cancelOrder(config: CancelOrderConfig): Promise<any> {
    return await this.ordersApi.cancelOrder(config);
  }

  async getOrdersByQuery(config: OrdersByQueryConfig): Promise<Order[]> {
    return await this.ordersApi.getOrdersByQuery(config);
  }

  async getOrder(config: GetOrderConfig): Promise<Order> {
    return await this.ordersApi.getOrder(config);
  }

  async getTransactionsByQuery(config: GetTransactionsByQueryConfig): Promise<Transaction[]> {
    return await this.transactionApi.getTransactionsByQuery(config);
  }

  async getTransactions(config: GetTransactionsConfig): Promise<Transaction[]> {
    return await this.transactionApi.getTransactions(config);
  }

  async getHours(config: HoursConfig): Promise<HoursResponse> {
    return await this.hoursApi.getHours(config);
  }

  async getPriceHistory(config: PriceHistoryConfig): Promise<PriceHistoryResponse> {
    return await this.priceHistoryApi.getPriceHistory(config);
  }

  async authenticate(config: OAuthData): Promise<OAuthResponse> {
    return await oauth(config, this.client);
  }
}
