import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Middleware, HttpStatus, ErrorCode } from '@kwokka/common-node';
import { CaptchaService } from '../../service';

@injectable()
export class CaptchaMiddleware implements Middleware {
  public constructor(@inject(CaptchaService) private captchaService: CaptchaService) {}

  public perform = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const captcha = this.parseCaptchaQuery(req);
    const isCaptchaValid = await this.captchaService.verify(captcha);
    if (!isCaptchaValid) {
      res
        .status(HttpStatus.BadRequest)
        .json({ error: { code: ErrorCode.CaptchaInvalid, message: 'Provided captcha is not valid.' } })
        .end();
      return;
    }

    return next();
  };

  private parseCaptchaQuery(req: Request) {
    const originalValue = req.query.captcha;
    const stringValue = (Array.isArray(originalValue) ? originalValue[0] : originalValue) as string;
    return stringValue;
  }
}
