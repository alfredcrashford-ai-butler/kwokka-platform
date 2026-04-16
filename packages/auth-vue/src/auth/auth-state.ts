export enum KwokkaAuthState {
  Initial = 'initial',
  SignInAnonymous = 'anonymous',
  SignInEmailPassword = 'email_password',
  SignInGoogle = 'google',
  SignInDiscord = 'discord',
  Callback = 'callback',
  Success = 'success',
  ResetPasswordRequest = 'reset_password_request',
  ResetPassword = 'reset_password',
}
