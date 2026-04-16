import { NextFunction, Request, Response } from 'express';
import { inject, injectable, unmanaged } from 'inversify';
import { ErrorCode } from '../../../util';
import { HttpStatus, ViewModel } from '../../router';
import { LoggerService } from '../../service';
import { Middleware } from '../middleware';
import { ValidationConfig } from './validation-config';

@injectable()
export class ValidationMiddleware implements Middleware {
  public constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @unmanaged() private readonly config: ValidationConfig = new ValidationConfig(null),
  ) {}

  public withViewModel(viewModel?: ViewModel): ValidationMiddleware {
    const config = new ValidationConfig(viewModel);
    if (!config.isValid) {
      throw new RangeError(`Validation config is invalid! Config: ${JSON.stringify(viewModel)}`);
    }

    return new ValidationMiddleware(this.logger, config);
  }

  public perform = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = this.config.validate({ body: req.body, params: req.params, query: req.query });

      if (result.errors) {
        const message = `Errors: ${result.errors.join(', ')}`;
        const status = HttpStatus.BadRequest;
        this.logger.warn(`${req.method} ${req.originalUrl} ${status}`);
        res
          .status(status)
          .json({ error: { code: ErrorCode.ValidationError, message } })
          .end();
        return;
      }

      return next();
    } catch (error) {
      const message = `Unexpected error in validation: ${error?.message || error}`;
      this.logger.error(message);
      res
        .status(HttpStatus.InternalServerError)
        .json({ error: { code: ErrorCode.UnexpectedError, message } })
        .end();
    }
  };
}
