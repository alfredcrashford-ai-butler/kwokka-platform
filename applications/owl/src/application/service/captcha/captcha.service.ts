import { injectable } from 'inversify';

@injectable()
export abstract class CaptchaService {
  public abstract verify(captcha: string): Promise<boolean>;
}
