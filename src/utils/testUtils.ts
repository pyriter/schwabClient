import { LocalFileCredentialProvider } from '../providers/localFileCredentialProvider';
import { AuthorizationTokenInterceptor } from '../connection/authorizationTokenInterceptor';
import { CREDENTIALS_FILE_NAME } from './constants';
import { Client } from '../connection/client';
import { SchwabClient } from '../connection/schwabClient';
import { LocalCacheCredentialProvider } from '../providers/localCacheCrendentialProvider';

export function provideClientWithLocalFileCredentialProvider() {
  const provider = new LocalFileCredentialProvider(CREDENTIALS_FILE_NAME);
  const client = new Client();
  const authorizationInterceptor = new AuthorizationTokenInterceptor(provider);
  client.addInterceptor(authorizationInterceptor);
  return client;
}

export async function provideClientWithLocalCacheCredentialProvider() {
  const localFileCredentialProvider = new LocalFileCredentialProvider(CREDENTIALS_FILE_NAME);
  const { access_token, client_id, refresh_token } = await localFileCredentialProvider.getCredential();
  const localProvider = new LocalCacheCredentialProvider({
    client_secret: '',
    code: '',
    id_token: '',
    access_token,
    access_token_modified_date: 0,
    client_id,
    expires_in: 0,
    redirect_uri: '',
    refresh_token,
    refresh_token_expires_in: 0,
    refresh_token_modified_date: 0,
    user_name: '',
    password: '',
  });
  const client = new Client();
  const authorizationInterceptor = new AuthorizationTokenInterceptor(localProvider);
  client.addInterceptor(authorizationInterceptor);
  return client;
}

export async function provideSchwabClientWithLocalCacheProvider(): Promise<SchwabClient> {
  const localFileCredentialProvider = new LocalFileCredentialProvider(CREDENTIALS_FILE_NAME);
  const { access_token, client_id, refresh_token } = await localFileCredentialProvider.getCredential();
  return SchwabClient.from({
    access_token,
    client_id,
    refresh_token,
  });
}

export async function provideSchwabClientWithLocalFileProvider(): Promise<SchwabClient> {
  const localFileCredentialProvider = new LocalFileCredentialProvider(CREDENTIALS_FILE_NAME);
  return SchwabClient.from({
    authorizationInterceptor: new AuthorizationTokenInterceptor(localFileCredentialProvider),
  });
}
