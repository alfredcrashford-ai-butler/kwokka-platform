import { inject, injectable } from 'inversify';
import { HttpService, ConfigService, LoggerService } from '@kwokka/common-node';
import { CaptchaService } from './captcha.service';
import { EnvVarName } from '../../env-var-name';

@injectable()
export class HCaptchaService extends CaptchaService {
  private readonly verifyUrl = 'https://hcaptcha.com/siteverify';
  private readonly secret: string;

  public constructor(
    @inject(HttpService) private httpService: HttpService,
    @inject(ConfigService) private configService: ConfigService,
    @inject(LoggerService) private logger: LoggerService,
  ) {
    super();
    this.secret = this.configService.get(EnvVarName.HCaptchaSecretKey);
  }

  public async verify(captcha: string): Promise<boolean> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const body = `response=${captcha}&secret=${this.secret}`;
    try {
      const result = await this.httpService.post<any>(this.verifyUrl, { body, headers });
      return result.success;
    } catch (error) {
      this.logger.error(`Could not verify captcha, error: ${error.message}`);
      return false;
    }
  }
}
