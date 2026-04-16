import { NextFunction, Request, Response } from 'express';

export interface Middleware {
  perform(req: Request, res: Response, next: NextFunction);
}
