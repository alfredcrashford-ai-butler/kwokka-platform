import { injectable } from 'inversify';

export enum TranslationLocales {
  RU = 'ru',
  EN = 'en',
}

@injectable()
export abstract class TranslationService<TranslationInstance = any> {
  public abstract get i18n(): TranslationInstance;
  public abstract localize(token: string, values?: object): string;
  public abstract localizePlural(token: string, n: number, values?: object): string;
  public abstract localizeDate(token: string, date: Date): string;
  public abstract localizeNumber(token: string, n: number): string;
  public abstract localizeTimeDiff(seconds: number): string;
  public abstract isExisting(token: string): boolean;
  public abstract setLocale(locale: TranslationLocales | string): Promise<boolean>;
  public abstract saveLocale(locale: TranslationLocales | string): void;
  public abstract getSavedLocale(): string;
  public abstract setAndSaveLocale(locale: TranslationLocales | string): Promise<boolean>;
}
