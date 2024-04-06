import { CredentialProvider, SchwabCredential } from './credentialProvider';

export class LocalCacheCredentialProvider implements CredentialProvider {
  constructor(private tdaCredential: SchwabCredential) {}

  async updateCredential(tdaCredential: SchwabCredential): Promise<void> {
    this.tdaCredential = tdaCredential;
  }

  update(tdaCredential: SchwabCredential): Promise<void> {
    throw new Error('Not implemented');
  }

  async getCredential(): Promise<SchwabCredential> {
    return this.tdaCredential;
  }

  fetch(): Promise<SchwabCredential> {
    throw new Error('Not implemented');
  }
}
