import {AccountApi} from './accounts';
import {provideClientWithLocalFileCredentialProvider} from '../utils/testUtils';

describe('Accounts', () => {
  const accountApi = new AccountApi(provideClientWithLocalFileCredentialProvider());

  it('should be able to get all accounts', async () => {
    const response = await accountApi.getAllAccounts();
    const securitiesAccount = response.pop();

    expect(securitiesAccount?.currentBalances).toBeDefined();
    expect(securitiesAccount?.accountNumber).toBeDefined();
    expect(securitiesAccount?.accountId).toBeDefined();
    expect(securitiesAccount?.hashValue).toBeDefined();
  });

  it('should be able to get account number metadata', async () => {
    const response = await accountApi.getAccountNumbers();
    const accountNumberMetadata = response.pop();

    expect(accountNumberMetadata?.accountNumber).toBeDefined();
    expect(accountNumberMetadata?.hashValue).toBeDefined();
  });

  it('should be able to get account info given encrypted account id', async () => {
    const response = await accountApi.getAccountNumbers();
    const accountNumberMetadata = response.pop();
    const {hashValue} = accountNumberMetadata || {hashValue: ""};

    const securitiesAccount = await accountApi.getAccount({accountNumberHashValue: hashValue});

    expect(securitiesAccount.accountNumber).toBeDefined();
    expect(securitiesAccount.accountId).toBeDefined();
    expect(securitiesAccount.hashValue).toBeDefined();
  });
});
