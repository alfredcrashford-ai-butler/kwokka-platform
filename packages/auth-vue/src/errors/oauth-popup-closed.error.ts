import { KwokkaAuthError } from './kwokka-auth-error';

const CODE = 'OAUTH_POPUP_CLOSED';
const MESSAGE = 'The oauth popup has been closed.';

export class OauthPopupClosedError extends KwokkaAuthError {
  public constructor(data: any) {
    super(MESSAGE, CODE, data);
  }
}
