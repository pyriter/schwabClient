import { ArrayFormatType, Request, ResponseType } from '../models/connect';
import { OAUTH2_TOKEN } from '../connection/routes.config';
import { Client } from '../connection/client';

export enum GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  REFRESH_TOKEN = 'refresh_token',
}

export enum AccessType {
  OFFLINE = 'offline',
  NONE = '',
}

export interface OAuthData {
  grant_type: GrantType;
  refresh_token?: string;
  access_type: AccessType; // = AccessType.OFFLINE;
  code?: string;
  client_id: string;
  redirect_uri: string;
}

export interface OAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: 0;
  scope: string;
  refresh_token_expires_in: 0;
}

/*
 The token endpoint returns an access token along with an optional refresh token.

 The purpose of this function is to get an access token which can be used to authorize calls
 Or if you have a refresh token, it can be used to get another access token
 */

export async function oauth(oAuthData: OAuthData, client: Client): Promise<OAuthResponse> {
  const response = await client.post({
    url: OAUTH2_TOKEN,
    data: oAuthData,
    responseType: ResponseType.URL_FORM_ENCODED,
    arrayFormat: ArrayFormatType.COMMA,
    // headers: {
    //   'Authorization': `${}:${}`
    // }
  } as Request);
  return response.data;
}
