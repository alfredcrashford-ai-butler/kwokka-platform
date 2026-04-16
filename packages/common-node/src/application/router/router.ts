import { Router as ExpressRouter, NextFunction, Request, Response } from 'express';
import { inject, injectable, unmanaged } from 'inversify';
import { UsecaseException } from '../../usecase';
import { ErrorCode } from '../../util';
import { Middleware } from '../middleware';
import { ErrorTrackerService, LoggerService } from '../service';
import { ApiResult } from './api-result';
import { HttpStatus } from './http-status';
import { ControllerException } from './controller';

export type HandlingFunction = (req: Request, res: Response, next: NextFunction) => Promise<ApiResult>;

@injectable()
export abstract class Router {
  @inject(LoggerService)
  protected logger: LoggerService;

  @inject(ErrorTrackerService)
  protected errorTrackerService: ErrorTrackerService;

  public constructor(@unmanaged() protected router: ExpressRouter = ExpressRouter()) {}

  public get(url: string, middlewareClasses: Middleware[] = [], handler: HandlingFunction): void {
    const middlewares = middlewareClasses.map((el) => el.perform);
    this.router.get(url, ...middlewares, this.buildHandler(handler));
  }

  public post(url: string, middlewareClasses: Middleware[] = [], handler: HandlingFunction): void {
    const middlewares = middlewareClasses.map((el) => el.perform);
    this.router.post(url, ...middlewares, this.buildHandler(handler));
  }

  public put(url: string, middlewareClasses: Middleware[] = [], handler: HandlingFunction): void {
    const middlewares = middlewareClasses.map((el) => el.perform);
    this.router.put(url, ...middlewares, this.buildHandler(handler));
  }

  public delete(url: string, middlewareClasses: Middleware[] = [], handler: HandlingFunction): void {
    const middlewares = middlewareClasses.map((el) => el.perform);
    this.router.delete(url, ...middlewares, this.buildHandler(handler));
  }

  public patch(url: string, middlewareClasses: Middleware[] = [], handler: HandlingFunction): void {
    const middlewares = middlewareClasses.map((el) => el.perform);
    this.router.patch(url, ...middlewares, this.buildHandler(handler));
  }

  public addRouter(url: string, router: Router): void {
    this.router.use(url, router.getRouter());
  }

  public getRouter(): ExpressRouter {
    return this.router;
  }

  protected use(middleware: Middleware): void {
    this.router.use(middleware.perform);
  }

  protected buildHandler(handler: HandlingFunction) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      this.logger.info(`${req.method} ${req.originalUrl}`);
      handler(req, res, next)
        .then((data) => this.handleSuccess(req, res, data))
        .catch((error) => this.handleError(req, res, error));
    };
  }

  protected handleError(req: Request, res: Response, err: Error): void {
    const meta = { timestamp: Date.now() };
    if (err instanceof UsecaseException) {
      const error = { code: err.code, message: err.message };
      this.logger.warn(`${req.method} ${req.originalUrl}\n${err.stack}`);
      res.status(HttpStatus.BadRequest).json({ error, meta }).end();
      return;
    }

    if (err instanceof ControllerException) {
      const error = { code: err.code, message: err.message };
      this.logger.warn(`${req.method} ${req.originalUrl}\n${err.stack}`);
      res
        .status(err.status || HttpStatus.BadRequest)
        .json({ error, meta })
        .end();
      return;
    }

    const error = { code: ErrorCode.UnexpectedError, message: 'Unexpected error' };
    this.logger.error(`${req.method} ${req.originalUrl}\n${err.stack}`);
    this.errorTrackerService.captureError(err);
    res.status(HttpStatus.InternalServerError).json({ error, meta }).end();
    return;
  }

  protected handleSuccess(req: Request, res: Response, result: ApiResult): void {
    const meta = { ...result.metadata, timestamp: Date.now() };
    const data: any = { data: result.data, meta };
    if (result.error) {
      data.error = result.error;
    }
    const logMessage = `${req.method} ${req.originalUrl} ${result.status}`;

    if (result.status !== HttpStatus.Ok) {
      this.logger.warn(logMessage);
    } else {
      this.logger.info(logMessage);
    }
    res.status(result.status).json(data).end();
  }
}
