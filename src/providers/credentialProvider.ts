export interface SchwabCredential {
  access_token: string;
  refresh_token: string;
  scope?: string;
  expires_in: number;
  refresh_token_expires_in: number;
  token_type?: string;
  access_token_modified_date: number;
  refresh_token_modified_date: number;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  code: string;
  id_token: string;
  user_name: string;
  password: string;
}

export interface CredentialProvider {
  // Initiates the call to get credentials with a chance to do some preprocessing
  // Is called by AuthorizationTokenInterceptor
  getCredential(): Promise<SchwabCredential>;

  // Makes the call to get the credential from the persistent store
  // Is called by getCredential. See above.
  fetch(): Promise<SchwabCredential>;

  // Initiates the call to update credentials with a chance to do some preprocessing
  // Is called by AuthorizationTokenInterceptor
  updateCredential(tdaCredential: Partial<SchwabCredential>): Promise<void>;

  // Makes the call to update the credential to the persistent store.
  // Is called by updateCredential. See above.
  update(tdaCredential: SchwabCredential): Promise<void>;
}
