import { inject, injectable, injectFromBase } from 'inversify';
import { AuthMiddleware, ConfigService, EnvVarName, HttpStatus, Router } from '@kwokka/common-node';
import { NextFunction, Request } from 'express';

@injectable()
@injectFromBase()
export class SubauthRouter extends Router {
  private readonly host: string;
  private readonly okResponse = { status: HttpStatus.Ok, data: null };

  public constructor(
    @inject(AuthMiddleware) authMiddleware: AuthMiddleware,
    @inject(ConfigService) private config: ConfigService,
  ) {
    super();
    this.host = this.config.get(EnvVarName.Host);
    const parseAccessTokenFromQueryMiddleware = {
      perform: (req: Request, _, next: NextFunction) => this.parseAccessTokenFromQuery(req, next),
    };
    this.get('/{*splat}', [parseAccessTokenFromQueryMiddleware, authMiddleware], async () => this.okResponse);
  }

  private parseAccessTokenFromQuery(req: Request, next: NextFunction) {
    if (!req.headers.authorization) {
      const originalUrl = req.headers['x-original-uri'] as string;
      const parsedUrl = new URL(originalUrl, this.host);
      const query = parsedUrl.searchParams;
      const token = query.get('accessToken');
      if (token) {
        req.headers.authorization = `Bearer ${token}`;
      }
    }
    next();
  }
}
