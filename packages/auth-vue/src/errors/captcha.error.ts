import { KwokkaAuthError } from './kwokka-auth-error';

const CODE = 'CAPTCHA_ERROR';
const MESSAGE = 'Failed to complete captcha.';

export class CaptchaError extends KwokkaAuthError {
  public constructor(data: any) {
    super(MESSAGE, CODE, data);
  }
}
