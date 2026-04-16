import { injectable } from 'inversify';

@injectable()
export class ConfigService {
  public readonly frontendConfig = Object.freeze({
    version: import.meta.env.VITE_APP_VERSION,
    apiGateway: import.meta.env.VITE_APP_API_GATEWAY,
    authGateway: `${import.meta.env.VITE_APP_API_GATEWAY}owl`,
    avatarGateway: `${import.meta.env.VITE_APP_API_GATEWAY}capybara`,
    wsGateway: import.meta.env.VITE_APP_WS_GATEWAY,
    rootUrl: import.meta.env.VITE_APP_ROOT_URL,
    tosUrl: import.meta.env.VITE_APP_TOS_URL,
    ppUrl: import.meta.env.VITE_APP_PP_URL,
    hcaptchakey: import.meta.env.VITE_APP_H_CAPTCHA_KEY,
    socials: {
      discordServer: 'https://discord.gg/z5NQUVRnTM',
      instagram: 'https://instagram.com/kwokka.co?igshid=MzNlNGNkZWQ4Mg==',
      telegramChannel: 'https://t.me/kwokka_co',
    },
    trackingConfig: {
      sentry: {
        environment: import.meta.env.NODE_ENV,
        dsn: import.meta.env.VITE_APP_SENTRY_DSN,
      },
      ga: {
        resourseId: import.meta.env.VITE_APP_GA_RESOURCE_ID,
      },
    },
    oauth: {
      googleClientId: import.meta.env.VITE_APP_GOOGLE_API_CLIENT_ID,
      discordClientId: import.meta.env.VITE_APP_DISCORD_API_CLIENT_ID,
      discordAuthRedirectUri: import.meta.env.VITE_APP_DISCORD_AUTH_REDIRECT_URI,
      discordAddCredentialRedirectUri: import.meta.env.VITE_APP_DISCORD_ADD_CREDENTIAL_REDIRECT_URI,
    },
  });
}
