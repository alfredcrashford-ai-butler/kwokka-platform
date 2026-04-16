import { KwokkaAuthError } from './kwokka-auth-error';

const CODE = 'OAUTH_FAILED_ERROR';
const MESSAGE = 'Failed to complete oauth2 flow.';

export class OauthFailedError extends KwokkaAuthError {
  public constructor(data: any) {
    super(MESSAGE, CODE, data);
  }
}
