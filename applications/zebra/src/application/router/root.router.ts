import { Router } from '@kwokka/common-node';
import { inject, injectable, injectFromBase } from 'inversify';
import { V1RootRouter } from './v1';

@injectable()
@injectFromBase()
export class RootRouter extends Router {
  public constructor(@inject(V1RootRouter) private v1RootRouter: V1RootRouter) {
    super();
    this.addRouter('/v1', this.v1RootRouter);
  }
}
