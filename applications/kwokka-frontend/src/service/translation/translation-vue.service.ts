import { createI18n, type VueI18n, type I18n } from 'vue-i18n';
import { inject, injectable } from 'inversify';
import { LoggerService } from '../logger/logger.service';
import { PersistenceService } from '../persistence/persistence.service';
import { TranslationService, TranslationLocales } from './translation.service';
import { messages as defaultMessages } from './lang/en';
import { PersistenceKey } from '../persistence/persistence-key';

@injectable()
export class VueTranslationServiceImpl extends TranslationService<I18n> {
  private instance: I18n;

  private readonly defaultLocale = 'en';

  private loadedLocales: string[] = [this.defaultLocale];

  public get i18n(): I18n {
    return this.instance;
  }

  private get translator(): VueI18n {
    return this.i18n.global as VueI18n;
  }

  public constructor(
    @inject(PersistenceService) private persistenceService: PersistenceService,
    @inject(LoggerService) private logger: LoggerService,
  ) {
    super();

    this.instance = createI18n({
      locale: TranslationLocales.EN,
      messages: defaultMessages,
      fallbackLocale: TranslationLocales.EN,
      warnHtmlInMessage: 'off',
      pluralizationRules: {
        ru: this.pluralizeRu,
      },
    });

    const localeFromPersistence = this.persistenceService.loadValue(PersistenceKey.Locale);
    if (localeFromPersistence) {
      this.setLocaleAsync(localeFromPersistence);
    } else {
      const locale = this.transformLocaleToSupportedLocale(navigator.language) || TranslationLocales.EN;
      this.setLocaleAsync(locale);
      this.saveLocale(locale);
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
    return this.translator.te(token) || this.translator.te(token, this.defaultLocale);
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
    return this.persistenceService.loadValue(PersistenceKey.Locale) || this.defaultLocale;
  }

  public async setAndSaveLocale(locale: string): Promise<boolean> {
    try {
      await this.setLocale(locale);
      this.saveLocale(locale);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
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
      const { messages } = await this.loadLocale(locale);
      this.instance.global.setLocaleMessage(locale, messages[locale]);
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
    document.querySelector('html').setAttribute('lang', locale);
  }

  private loadLocale(locale: string) {
    if (locale === TranslationLocales.RU) {
      return import(/* webpackChunkName: "i18n-ru" */ '@/service/translation/lang/ru');
    }
    return import(/* webpackChunkName: "i18n-en" */ `@/service/translation/lang/${this.defaultLocale}`);
  }

  private transformLocaleToSupportedLocale(locale: string): string {
    if (!locale) {
      return null;
    }
    const supportedLocales = Object.values(TranslationLocales);
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
