import { CredentialProvider, SchwabCredential } from './credentialProvider';

export abstract class CredentialProviderImpl implements CredentialProvider {
  async fetch(): Promise<SchwabCredential> {
    throw Error('You must implement a function to get the credential information and return it');
  }

  async update(tdaCredential: SchwabCredential): Promise<void> {
    throw Error('You must implement a function to store the given credential');
  }

  async updateCredential(tdaCredential: SchwabCredential): Promise<void> {
    const originalCredential = await this.getCredential();
    const credential = {
      ...originalCredential,
      ...tdaCredential,
      modified_date: Date.now(),
    };
    await this.update(credential);
  }

  async getCredential(): Promise<SchwabCredential> {
    return await this.fetch();
  }
}
