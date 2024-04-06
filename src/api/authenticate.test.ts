import { GrantType, oauth, OAuthData } from './authenticate';
import { LocalFileCredentialProvider } from '../providers/localFileCredentialProvider';
import { CREDENTIALS_FILE_NAME } from '../utils/constants';
import { Client } from '../connection/client';

describe('Authenticate', () => {
  xit('should be able to get an new access token and refresh token', async () => {
    const localFileCredentialProvider = new LocalFileCredentialProvider(CREDENTIALS_FILE_NAME);

    const credentials = await localFileCredentialProvider.getCredential();
    const { client_id, redirect_uri, client_secret, code } = credentials;

    const response = await oauth(
      {
        client_id,
        client_secret,
        redirect_uri,
        grant_type: GrantType.AUTHORIZATION_CODE,
        code,
      } as OAuthData,
      new Client(),
    );

    const { access_token, refresh_token, expires_in, id_token, scope } = response;

    await localFileCredentialProvider.update({
      ...credentials,
      access_token,
      refresh_token,
      expires_in,
      id_token,
      scope,
    });

    expect(response.access_token);
    expect(response.refresh_token);
  });

  it('should be able to get a new refresh token', async () => {
    const localFileCredentialProvider = new LocalFileCredentialProvider(CREDENTIALS_FILE_NAME);

    const credentials = await localFileCredentialProvider.getCredential();
    const { client_id, redirect_uri, client_secret, refresh_token } = credentials;

    const response = await oauth(
      {
        client_id,
        client_secret,
        grant_type: GrantType.REFRESH_TOKEN,
        refresh_token,
      } as OAuthData,
      new Client(),
    );

    const { access_token, refresh_token: refresh_token_response, expires_in, id_token, scope } = response;

    await localFileCredentialProvider.update({
      ...credentials,
      access_token,
      refresh_token: refresh_token_response,
      expires_in,
      id_token,
      scope,
    });

    expect(response.access_token);
    expect(response.refresh_token);
  });
});
