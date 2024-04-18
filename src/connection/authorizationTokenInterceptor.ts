import { GrantType, oauth, OAuthData } from '../api/authenticate';
import { AUTHENTICATION, OAUTH2_TOKEN } from './routes.config';
import { CredentialProvider, SchwabCredential } from '../providers/credentialProvider';
import { AxiosError } from 'axios';
import { Interceptor } from './interceptor';
import { Client } from './client';

const MAX_RETRIES = 1;

export class AuthorizationTokenInterceptor extends Interceptor {
  private authTokenRefreshRetries = MAX_RETRIES;

  constructor(private readonly credentialProvider: CredentialProvider) {
    super();
  }

  async onSuccessRequestHandler(config): Promise<any> {
    if (config.url?.includes(AUTHENTICATION) || config.url?.includes(OAUTH2_TOKEN)) return config;
    const accessToken = await this.getAccessToken();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  }

  async onErrorResponseHandler(error: AxiosError, client: Client): Promise<any> {
    const { config = {}, response } = error;

    if (config.url?.includes(OAUTH2_TOKEN) || config.url?.includes(AUTHENTICATION)) return error;

    if (response?.status === 401 && this.authTokenRefreshRetries > 0) {
      console.info(`Response is 401: ${JSON.stringify(error)}`);
      this.authTokenRefreshRetries--;
      await this.refreshAccessToken(client);
      const secondResponse = await client.connect(config);
      this.resetAuthTokenRefreshRetries();
      return secondResponse;
    }

    throw error;
  }

  private resetAuthTokenRefreshRetries() {
    this.authTokenRefreshRetries = MAX_RETRIES;
  }

  private async getAccessToken(): Promise<string> {
    const { access_token } = await this.getCredential();
    return access_token;
  }

  private async generateOAuthData(): Promise<OAuthData> {
    const tdaCredential = await this.getCredential();
    const { client_id, redirect_uri, refresh_token, client_secret, code } = tdaCredential;
    return {
      client_secret,
      client_id,
      redirect_uri,
      refresh_token,
      grant_type: GrantType.REFRESH_TOKEN,
    };
  }

  private async refreshAccessToken(client: Client) {
    const oAuthData = await this.generateOAuthData();
    const credential = await oauth(oAuthData, client);

    const now = Date.now();
    await this.updateCredential({
      ...credential,
      access_token_modified_date: now,
      refresh_token_modified_date: now,
    });
  }

  private async getCredential(): Promise<SchwabCredential> {
    return await this.credentialProvider.getCredential.bind(this.credentialProvider)();
  }

  private async updateCredential(tdaCredential: Partial<SchwabCredential>): Promise<void> {
    await this.credentialProvider.updateCredential.bind(this.credentialProvider, tdaCredential)();
  }
}
