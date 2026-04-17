import { injectable } from 'inversify';

@injectable()
export class ConfigService {
  private readonly kwokkaEndpoint = import.meta.env.VITE_APP_KWOKKA_ENDPOINT;
  public readonly isProduction = import.meta.env.PROD;

  public readonly frontendConfig = Object.freeze({
    version: import.meta.env.VITE_APP_VERSION,
    environment: import.meta.env.NODE_ENV,
    kwokkaEndpoint: this.kwokkaEndpoint,
    kwokkaDecorationsSrc: import.meta.env.VITE_APP_KWOKKA_DECORATIONS_SRC,
    kwokkaItemsSrc: import.meta.env.VITE_APP_KWOKKA_ITEMS_SRC,
    authGateway: `${this.kwokkaEndpoint}/owl`,
    avatarGateway: `${this.kwokkaEndpoint}/capybara`,
    rootUrl: import.meta.env.VITE_APP_ROOT_URL,
    gameServerUrl: import.meta.env.VITE_APP_GAME_SERVER_URL,
    hcaptchakey: import.meta.env.VITE_APP_H_CAPTCHA_KEY,
    resourcesCacheName: import.meta.env.VITE_APP_RESOURCES_CACHE_NAME,
    links: {
      website: import.meta.env.VITE_APP_LINK_WEBSITE,
      kwokkaWebsite: import.meta.env.VITE_APP_LINK_KWOKKA_WEBSITE,
      privacyPolicy: import.meta.env.VITE_APP_LINK_PRIVACY_POLICY,
      legalNotice: import.meta.env.VITE_APP_LINK_LEGAL_NOTICE,
    },
    cookieConsent: {
      libScriptSrc: import.meta.env.VITE_APP_COOKIE_CONSENT_LIB_SCRIPT_SRC,
      scriptSrc: import.meta.env.VITE_APP_COOKIE_CONSENT_SCRIPT_SRC,
      styleSrc: import.meta.env.VITE_APP_COOKIE_CONSENT_STYLE_SRC,
    },
    socials: {
      discordServer: 'https://discord.gg/QYsbRWbVtQ',
      reddit: 'https://www.reddit.com/r/PawsomeElements',
      instagram: 'https://www.instagram.com/pawsome_elements',
      tiktok: 'https://www.tiktok.com/@pawsome.elements?is_from_webapp=1&sender_device=pc',
      youtube: 'https://www.youtube.com/@pawsome-elements',
    },
    sentryDsn: import.meta.env.VITE_APP_SENTRY_DSN,
    ga: {
      resourseId: import.meta.env.VITE_APP_GA_RESOURCE_ID,
    },
    ad: {
      client: import.meta.env.VITE_APP_GOOGLE_ADS_CLIENT_ID,
      frequency: '30s',
    },
    rybbit: {
      siteId: import.meta.env.VITE_APP_RYBBIT_SITE_ID,
    },
    clarity: {
      projectId: import.meta.env.VITE_APP_CLARITY_PROJECT_ID,
    },
    oauth: {
      googleClientId: import.meta.env.VITE_APP_GOOGLE_API_CLIENT_ID,
      discordClientId: import.meta.env.VITE_APP_DISCORD_API_CLIENT_ID,
      discordAuthRedirectUri: import.meta.env.VITE_APP_DISCORD_AUTH_REDIRECT_URI,
      discordAddCredentialRedirectUri: import.meta.env.VITE_APP_DISCORD_ADD_CREDENTIAL_REDIRECT_URI,
    },
  });
}
