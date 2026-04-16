import { ErrorCode } from './error-code';
import { KwokkaAvatarError } from './kwokka-avatar-error';

const MESSAGE = 'Profile is not set up.';

export class ProfileNotSetupError extends KwokkaAvatarError {
  public constructor(accountId: string) {
    super(MESSAGE, ErrorCode.ProfileNotSetUp, { accountId });
  }
}
