import { OauthPopupClosedError } from '@/errors/oauth-popup-closed.error';
import { OauthFailedError } from '@/errors/oauth-failed.error';
import { injectScript } from '@/utils/inject';

declare const google: any;
type GoogleOauth2PopupError = 'popup_failed_to_open' | 'popup_closed' | 'unknown';
type GoogleOauth2Error = 'access_denied';
type ErrorCallbackResponse = { message: string; type: GoogleOauth2PopupError };
type CallbackResponse = {
  access_token?: string;
  error?: GoogleOauth2Error;
  error_description?: string;
  error_uri?: string;
};

const SCOPES = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

export interface OwlResponse<T> {
  data: T;
  meta: { timestamp: number };
}

export class GoogleOauth2Service {
  private isGsiScriptInjected = false;

  public constructor(private clientId: string = '') {}

  public setClientId(clientId: string): void {
    this.clientId = clientId;
  }

  public async performOauth2(): Promise<any> {
    await this.injectGsiScript();

    return new Promise((resolve, reject) => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: SCOPES,
        error_callback: (response: ErrorCallbackResponse) => {
          reject(new OauthPopupClosedError({ provider: 'google', response }));
        },
        callback: (response: CallbackResponse) => {
          if (response.error) {
            reject(new OauthFailedError({ provider: 'google', response }));
            return;
          }

          resolve(response.access_token);
        },
      });

      client.requestAccessToken();
    });
  }

  private async injectGsiScript(): Promise<void> {
    if (this.isGsiScriptInjected) {
      return;
    }

    await injectScript('https://accounts.google.com/gsi/client');
    this.isGsiScriptInjected = true;
  }
}
