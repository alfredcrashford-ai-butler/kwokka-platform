import { inject, injectable } from 'inversify';
import { KwokkaCookieConsent, type KwokkaCookieConsentTranslations } from '@kwokka/cookie-consent';
import { LoggerService } from '../logger';
import { ErrorTrackerService } from '../error-tracker';

let readyHandlers;

@injectable()
export class CookieService {
  private _ready = new Promise<void>((resolve, reject) => (readyHandlers = { resolve, reject }));
  private consent: KwokkaCookieConsent;

  public constructor(
    @inject(LoggerService) private logger: LoggerService,
    @inject(ErrorTrackerService) private errorTracker: ErrorTrackerService,
  ) {
    this.logger = this.logger.withPrefix('#CookieService:');
    this.consent = new KwokkaCookieConsent();
  }

  public async setup(locale: string, translations: KwokkaCookieConsentTranslations): Promise<void> {
    this.logger.log('Initializing cookie consent.');
    try {
      await this.consent.run(locale, translations);
      readyHandlers.resolve();
      this.logger.log('Cookie consent initialized.');
    } catch (e) {
      this.logger.error(e);
      this.errorTracker.captureError(e);
      readyHandlers.reject(e);
    }
  }

  public get ready(): Promise<void> {
    return this._ready;
  }

  public async setConsentHandler(handler: () => any): Promise<void> {
    await this.ready;
    this.consent.setOnConsent(handler);
  }

  public async setLanguage(locale: string, translations: KwokkaCookieConsentTranslations): Promise<void> {
    await this.ready;
    this.consent.setLanguage(locale, translations);
  }

  public async getDefaultGtagConsent(): Promise<Record<string, string>> {
    await this.ready;
    return this.consent.getDefaultGtagConsent();
  }

  public async showPreferences(): Promise<void> {
    await this.ready;
    this.consent.showPreferences();
  }

  public async getGtagConsent(): Promise<Record<string, string>> {
    await this.ready;
    return this.consent.getGtagConsent();
  }
}
