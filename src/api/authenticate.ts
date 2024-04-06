import { ArrayFormatType, Request, ResponseType } from '../models/connect';
import { OAUTH2_TOKEN } from '../connection/routes.config';
import { Client } from '../connection/client';
import { btoa } from 'node:buffer';

export enum GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  REFRESH_TOKEN = 'refresh_token',
}

export interface OAuthData {
  grant_type: GrantType;
  refresh_token?: string;
  code?: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export interface OAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
  id_token: string;
}

/*
 The token endpoint returns an access token along with an optional refresh token.

 The purpose of this function is to get an access token which can be used to authorize calls
 Or if you have a refresh token, it can be used to get another access token
 */
export async function oauth(oAuthData: OAuthData, client: Client): Promise<OAuthResponse> {
  const { grant_type, code, redirect_uri, client_id, client_secret, refresh_token } = oAuthData;
  const data = {
    grant_type,
    code,
    redirect_uri,
    refresh_token,
  };
  const authorization = btoa(`${client_id}:${client_secret}`);
  const response = await client.post({
    url: OAUTH2_TOKEN,
    data,
    responseType: ResponseType.URL_FORM_ENCODED,
    arrayFormat: ArrayFormatType.COMMA,
    headers: {
      Authorization: `Basic ${authorization}`,
    },
  } as Request);
  return response.data;
}
