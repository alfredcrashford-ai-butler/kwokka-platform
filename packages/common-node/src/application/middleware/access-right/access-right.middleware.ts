import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TokenEntity } from '@kwokka/entities';
import { ErrorCode } from '../../../util';
import { HttpStatus } from '../../router';
import { Middleware } from '../middleware';
import { LoggerService } from '../../service';

@injectable()
export class AccessRightMiddleware {
  public constructor(@inject(LoggerService) private logger: LoggerService) {}

  public get(rights: string[]): Middleware {
    const middleware: Middleware = {
      perform: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = res.locals.token as TokenEntity;
        if (!token) {
          const status = HttpStatus.Unauthorized;
          this.logger.warn(`${req.method} ${req.originalUrl} ${status}`);
          res
            .status(status)
            .json({ error: { code: ErrorCode.Unauthorized, message: 'Authentication is missing.' } })
            .end();
          return;
        }

        const accountHasAllRights = (rights || []).every((right) => (token?.content?.rights || []).includes(right));
        if (accountHasAllRights) {
          return next();
        }

        const status = HttpStatus.Forbidden;
        this.logger.warn(`${req.method} ${req.originalUrl} ${status}`);
        res
          .status(status)
          .json({ error: { code: ErrorCode.Forbidden, message: 'Account is forbidden to access this resource.' } })
          .end();
      },
    };
    return middleware;
  }
}
