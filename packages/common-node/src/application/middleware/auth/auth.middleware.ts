import { NextFunction, Request, Response } from 'express';
import { inject, injectable, unmanaged } from 'inversify';
import { Middleware } from '../middleware';
import { AuthService, LoggerService } from '../../service';
import { HttpStatus } from '../../router';
import { ErrorCode } from '../../../util';

@injectable()
export class AuthMiddleware implements Middleware {
  public constructor(
    @inject(LoggerService) private logger: LoggerService,
    @inject(AuthService) private authService: AuthService,
    @unmanaged() private isSkipExpiryCheck = false,
    @unmanaged() private isSkipRevokeCheck = false,
  ) {}

  public perform = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    const options = { skipExpiryCheck: this.isSkipExpiryCheck, skipRevokeCheck: this.isSkipRevokeCheck };
    const authInfo = await this.authService.getAuthInfo(authHeader, options);
    if (!authInfo.isAuthenticated) {
      return this.sendUserNotAuthorized(req, res);
    }

    res.locals.token = authInfo.token;
    res.locals.account = authInfo.account;

    return next();
  };

  public skipExpiryCheck(): AuthMiddleware {
    return new AuthMiddleware(this.logger, this.authService, true, this.isSkipRevokeCheck);
  }

  public skipRevokeCheck(): AuthMiddleware {
    return new AuthMiddleware(this.logger, this.authService, this.isSkipExpiryCheck, true);
  }

  private sendUserNotAuthorized(req: Request, res: Response): void {
    const status = HttpStatus.Unauthorized;
    this.logger.warn(`${req.method} ${req.originalUrl} ${status}`);
    res
      .status(status)
      .json({ error: { code: ErrorCode.Unauthorized, message: 'Authentication is missing.' } })
      .end();
  }
}
