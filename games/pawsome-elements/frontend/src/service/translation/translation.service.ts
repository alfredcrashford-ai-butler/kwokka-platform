import { createI18n, type VueI18n, type I18n } from 'vue-i18n';
import { inject, injectable } from 'inversify';
import { LoggerService } from '../logger';
import { PersistenceService } from '../persistence';
import { PersistenceKey } from '../persistence';
import { messages as defaultMessages } from './lang/en';
import { CookieService } from '../cookie';

export enum TranslationLocale {
  En = 'en',
  De = 'de',
  Pt = 'pt',
  Fr = 'fr',
  Nl = 'nl',
  Pl = 'pl',
  Es = 'es',
  It = 'it',
  Ru = 'ru',
  Tr = 'tr',
  Ja = 'ja',
  Zh = 'zh',
}

const DEFAULT_LOCALE = 'en';

@injectable()
export class TranslationService {
  private instance: I18n;

  private loadedLocales: string[] = [DEFAULT_LOCALE];

  public get i18n(): I18n {
    return this.instance;
  }

  private get translator(): VueI18n {
    return this.i18n.global as VueI18n;
  }

  public constructor(
    @inject(PersistenceService) private persistenceService: PersistenceService,
    @inject(LoggerService) private logger: LoggerService,
    @inject(CookieService) private cookieService: CookieService,
  ) {
    this.instance = createI18n({
      locale: TranslationLocale.En,
      messages: defaultMessages,
      fallbackLocale: TranslationLocale.En,
      warnHtmlInMessage: 'off',
      pluralizationRules: {
        ru: this.pluralizeRu,
      },
    });

    const localeFromPersistence = this.persistenceService.loadValue(PersistenceKey.Locale);
    if (localeFromPersistence) {
      this.setLocaleAsync(localeFromPersistence);
    } else {
      const locale = this.transformLocaleToSupportedLocale(navigator.language) || TranslationLocale.En;
      this.saveLocale(locale);
      this.setLocaleAsync(locale);
    }
  }

  public localize(token: string, values?: Record<string, any>): string {
    const result = this.translator.t(token, values);
    return result as string;
  }

  public localizePlural(token: string, n: number, values?: Record<string, any>): string {
    return this.translator.t(token, n, values);
  }

  public localizeDate(token: string, date: Date): string {
    return this.translator.d(date, token);
  }

  public localizeNumber(token: string, n: number): string {
    return this.translator.n(n, token);
  }

  public isExisting(token: string): boolean {
    return this.translator.te(token) || this.translator.te(token, DEFAULT_LOCALE);
  }

  public localizeTimeDiff(seconds: number): string {
    if (seconds < 60) {
      return this.localize('general.timeDiff.now');
    }

    if (seconds > 3600) {
      return this.localize('general.timeDiff.moreThanHour');
    }

    return this.localizePlural('general.timeDiff.minutes', Math.floor(seconds / 60));
  }

  public setLocale(locale: string): Promise<boolean> {
    if (this.instance.global.locale === locale) {
      return Promise.resolve(true);
    }

    return this.setLocaleAsync(locale);
  }

  public saveLocale(locale: string): void {
    this.persistenceService.storeValue(PersistenceKey.Locale, locale);
  }

  public getSavedLocale(): string {
    return this.persistenceService.loadValue(PersistenceKey.Locale) || DEFAULT_LOCALE;
  }

  public async setAndSaveLocale(locale: string): Promise<boolean> {
    try {
      this.saveLocale(locale);
      await this.setLocale(locale);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  public async getLocaleMessages(locale: string) {
    const { messages } = await this.loadLocale(locale);
    return messages[locale];
  }

  public async getCurrentLocaleMessages() {
    const locale = this.getCurrentLocale();
    const { messages } = await this.loadLocale(locale);
    return messages[locale];
  }

  public getCurrentLocale(): string {
    let locale = this.persistenceService.loadValue(PersistenceKey.Locale);
    locale ||= this.transformLocaleToSupportedLocale(navigator.language);
    locale ||= TranslationLocale.En;
    return locale;
  }

  private async setLocaleAsync(locale: string): Promise<boolean> {
    const supportedLocale = this.transformLocaleToSupportedLocale(locale);
    if (!supportedLocale) {
      return Promise.resolve(false);
    }

    if (this.loadedLocales.includes(supportedLocale)) {
      this.performLocaleSetting(supportedLocale);
      return Promise.resolve(true);
    }

    try {
      const messages = await this.getLocaleMessages(locale);
      this.instance.global.setLocaleMessage(locale, messages);
      this.loadedLocales.push(locale);
      this.performLocaleSetting(locale);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  private performLocaleSetting(locale: string) {
    this.instance.global.locale = locale;
    document.documentElement.lang = locale;
    this.localizeCookieConsent(locale);
  }

  private async localizeCookieConsent(locale: string): Promise<void> {
    const messages = await this.getLocaleMessages(locale);
    this.cookieService.setLanguage(locale, messages.cookieConsent);
  }

  private loadLocale(locale: string) {
    if (locale === TranslationLocale.Ru) {
      return import(/* webpackChunkName: "i18n-ru" */ '@/service/translation/lang/ru.js');
    }

    if (locale === TranslationLocale.Es) {
      return import(/* webpackChunkName: "i18n-es" */ '@/service/translation/lang/es.js');
    }

    if (locale === TranslationLocale.De) {
      return import(/* webpackChunkName: "i18n-de" */ '@/service/translation/lang/de.js');
    }

    if (locale === TranslationLocale.Fr) {
      return import(/* webpackChunkName: "i18n-fr" */ '@/service/translation/lang/fr.js');
    }

    if (locale === TranslationLocale.It) {
      return import(/* webpackChunkName: "i18n-it" */ '@/service/translation/lang/it.js');
    }

    if (locale === TranslationLocale.Nl) {
      return import(/* webpackChunkName: "i18n-nl" */ '@/service/translation/lang/nl.js');
    }

    if (locale === TranslationLocale.Pl) {
      return import(/* webpackChunkName: "i18n-pl" */ '@/service/translation/lang/pl.js');
    }

    if (locale === TranslationLocale.Tr) {
      return import(/* webpackChunkName: "i18n-tr" */ '@/service/translation/lang/tr.js');
    }

    if (locale === TranslationLocale.Zh) {
      return import(/* webpackChunkName: "i18n-zh" */ '@/service/translation/lang/zh.js');
    }

    if (locale === TranslationLocale.Ja) {
      return import(/* webpackChunkName: "i18n-ja" */ '@/service/translation/lang/ja.js');
    }

    if (locale === TranslationLocale.Pt) {
      return import(/* webpackChunkName: "i18n-pt" */ '@/service/translation/lang/pt.js');
    }

    return import(/* webpackChunkName: "i18n-en" */ `@/service/translation/lang/${DEFAULT_LOCALE}.js`);
  }

  private transformLocaleToSupportedLocale(locale: string): string {
    if (!locale) {
      return null;
    }
    const supportedLocales = Object.values(TranslationLocale);
    const supportedLocale = supportedLocales.find((el) => locale.includes(el));
    return supportedLocale || null;
  }

  private pluralizeRu(choice: number, choicesLength: number): number {
    if (choice === 0) {
      return 0;
    }

    const teen = choice > 10 && choice < 20;
    const endsWithOne = choice % 10 === 1;

    if (choicesLength < 4) {
      return !teen && endsWithOne ? 1 : 2;
    }
    if (!teen && endsWithOne) {
      return 1;
    }
    if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
      return 2;
    }

    return choicesLength < 4 ? 2 : 3;
  }
}
