import { ArrayFormatType, Request, ResponseType } from '../models/connect';
import { AccountConfig, AccountNumberMetadata, SecuritiesAccount } from '../models/accounts';
import { ACCOUNTS } from '../connection/routes.config';
import { Client } from '../connection/client';

export class AccountApi {
  constructor(private client: Client) {}

  async getAllAccounts(): Promise<SecuritiesAccount[]> {
    const url = `${ACCOUNTS}`;
    const response = await this.client.get({
      url,
      responseType: ResponseType.JSON,
      arrayFormat: ArrayFormatType.COMMA,
    } as Request);
    const accountMetadatas = await this.getAccountNumbers();
    return response.data.map((d) => {
      const securitiesAccount = d.securitiesAccount;
      const accountMetadata = accountMetadatas.find((a) => a.accountNumber === securitiesAccount.accountNumber);
      return {
        ...securitiesAccount,
        accountId: d.securitiesAccount.accountNumber,
        hashValue: accountMetadata?.hashValue,
      } as SecuritiesAccount;
    }) as SecuritiesAccount[];
  }

  async getAccount(config: AccountConfig): Promise<SecuritiesAccount> {
    const url = this.generateAccountUrl({ accountIdHashValue: config.accountNumberHashValue });
    const response = await this.client.get({
      url,
      responseType: ResponseType.JSON,
      arrayFormat: ArrayFormatType.COMMA,
    } as Request);

    const securitiesAccount = response.data.securitiesAccount;

    return {
      ...securitiesAccount,
      accountId: securitiesAccount.accountNumber,
      hashValue: config.accountNumberHashValue,
    };
  }

  async getAccountNumbers(): Promise<AccountNumberMetadata[]> {
    const url = `${ACCOUNTS}/accountNumbers`;
    const response = await this.client.get({
      url,
      responseType: ResponseType.JSON,
      arrayFormat: ArrayFormatType.COMMA,
    } as Request);
    return response.data;
  }

  generateAccountUrl(config: { accountIdHashValue: string }): string {
    const { accountIdHashValue } = config;
    const accountUIdUrlString = accountIdHashValue ? '/' + accountIdHashValue : '';
    return `${ACCOUNTS}${accountUIdUrlString}`;
  }
}
