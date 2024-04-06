import { AuthorizationTokenInterceptor } from './authorizationTokenInterceptor';
import { LocalFileCredentialProvider } from '../providers/localFileCredentialProvider';
import { LocalCacheCredentialProvider } from '../providers/localCacheCrendentialProvider';
import { SchwabCredential } from '../providers/credentialProvider';
import { SchwabClient, SchwabClientBuilderConfig } from './schwabClient';

export class SchwabClientBuilder {
  constructor(private config: SchwabClientBuilderConfig) {}

  build(): SchwabClient {
    const authorizationInterceptor = this.getAuthorizationInterceptor();
    return new SchwabClient({
      authorizationInterceptor,
    });
  }

  private getAuthorizationInterceptor(): AuthorizationTokenInterceptor {
    if (this.config.authorizationInterceptor) return this.config.authorizationInterceptor;
    let provider;
    if (this.config.fileName) {
      provider = new LocalFileCredentialProvider(this.config.fileName);
    } else {
      const { access_token, refresh_token, client_id, redirect_uri } = this.config;
      provider = new LocalCacheCredentialProvider({
        access_token,
        refresh_token,
        client_id,
        redirect_uri,
      } as SchwabCredential);
    }
    return new AuthorizationTokenInterceptor(provider);
  }
}
