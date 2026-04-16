import * as CookieConsent from 'vanilla-cookieconsent';
import {
  CAT_ADVERTISEMENT,
  CAT_ANALYTICS,
  CAT_FUNCTIONALITY,
  CAT_SECURITY,
  config,
  SERVICE_AD_PERSONALIZATION,
  SERVICE_AD_STORAGE,
  SERVICE_AD_USER_DATA,
  SERVICE_ANALYTICS_STORAGE,
  SERVICE_FUNCTIONALITY_STORAGE,
  SERVICE_PERSONALIZATION_STORAGE,
  SERVICE_SECURITY_STORAGE,
} from './config';

import './style.css';

export type KwokkaCookieConsentTranslations = CookieConsent.Translation & {
  services: Record<string, Record<string, { label: string }>>;
};

export class KwokkaCookieConsent {
  private onConsent = () => {};

  public async run(locale: string, translations: KwokkaCookieConsentTranslations): Promise<void> {
    const localizedConfig = this.localizeConfig(locale, translations);
    await CookieConsent.run(localizedConfig);
  }

  public async setLanguage(locale: string, translations: KwokkaCookieConsentTranslations): Promise<void> {
    CookieConsent.reset();
    const localizedConfig = this.localizeConfig(locale, translations);
    await CookieConsent.run(localizedConfig);
  }

  public getDefaultGtagConsent(): Record<string, 'granted' | 'denied'> {
    return {
      [SERVICE_AD_STORAGE]: 'denied',
      [SERVICE_AD_USER_DATA]: 'denied',
      [SERVICE_AD_PERSONALIZATION]: 'denied',
      [SERVICE_ANALYTICS_STORAGE]: 'denied',
      [SERVICE_FUNCTIONALITY_STORAGE]: 'denied',
      [SERVICE_PERSONALIZATION_STORAGE]: 'denied',
      [SERVICE_SECURITY_STORAGE]: 'denied',
    };
  }

  public showPreferences() {
    CookieConsent.showPreferences();
  }

  public getGtagConsent(): Record<string, 'granted' | 'denied'> {
    return {
      [SERVICE_ANALYTICS_STORAGE]: this.isServiceAccepted(SERVICE_ANALYTICS_STORAGE, CAT_ANALYTICS)
        ? 'granted'
        : 'denied',
      [SERVICE_AD_STORAGE]: this.isServiceAccepted(SERVICE_AD_STORAGE, CAT_ADVERTISEMENT) ? 'granted' : 'denied',
      [SERVICE_AD_USER_DATA]: this.isServiceAccepted(SERVICE_AD_USER_DATA, CAT_ADVERTISEMENT) ? 'granted' : 'denied',
      [SERVICE_AD_PERSONALIZATION]: this.isServiceAccepted(SERVICE_AD_PERSONALIZATION, CAT_ADVERTISEMENT)
        ? 'granted'
        : 'denied',
      [SERVICE_FUNCTIONALITY_STORAGE]: this.isServiceAccepted(SERVICE_FUNCTIONALITY_STORAGE, CAT_FUNCTIONALITY)
        ? 'granted'
        : 'denied',
      [SERVICE_PERSONALIZATION_STORAGE]: this.isServiceAccepted(SERVICE_PERSONALIZATION_STORAGE, CAT_FUNCTIONALITY)
        ? 'granted'
        : 'denied',
      [SERVICE_SECURITY_STORAGE]: this.isServiceAccepted(SERVICE_SECURITY_STORAGE, CAT_SECURITY) ? 'granted' : 'denied',
    };
  }

  public setOnConsent(fn: () => any): void {
    this.onConsent = fn;
  }

  private isServiceAccepted(service: string, category: string): boolean {
    return CookieConsent.acceptedService(service, category);
  }

  private localizeConfig(
    locale: string,
    translations: KwokkaCookieConsentTranslations,
  ): CookieConsent.CookieConsentConfig {
    const categories = JSON.parse(JSON.stringify(config.categories));
    const categoryNames = Object.keys(translations.services);
    categoryNames.forEach((categoryName) => {
      if (!categories[categoryName]) {
        return;
      }
      categories[categoryName].services = translations.services[categoryName];
    });

    return {
      ...config,
      categories,
      language: {
        default: locale,
        translations: { [locale]: translations },
      },
      onFirstConsent: () => this.onConsent(),
      onConsent: () => this.onConsent(),
      onChange: () => this.onConsent(),
    };
  }
}
