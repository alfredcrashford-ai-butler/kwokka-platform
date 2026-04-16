import { inject, injectable, injectFromBase } from 'inversify';
import { Request, Response } from 'express';
import { AccountEntity, DecorationEntity } from '@kwokka/entities';
import { ApiResult, CrudController, EntityNotFoundControllerException, HttpStatus } from '@kwokka/common-node';
import {
  CreateDecorationUsecase,
  DeleteDecorationUsecase,
  GetDecorationByIdUsecase,
  GetDecorationByKeyUsecase,
  ListAvailableDecorationsUsecase,
  ListDecorationsUsecase,
  UpdateDecorationUsecase,
} from '../../../../usecase/decoration';
import { DecorationV1Adapter } from './decoration-v1.adapter';

@injectable()
@injectFromBase()
export class DecorationV1Controller extends CrudController<DecorationEntity> {
  protected readonly adapter: DecorationV1Adapter = new DecorationV1Adapter();

  public constructor(
    @inject(ListDecorationsUsecase) protected readonly listUsecase: ListDecorationsUsecase,
    @inject(CreateDecorationUsecase) protected readonly createUsecase: CreateDecorationUsecase,
    @inject(UpdateDecorationUsecase) protected readonly updateUsecase: UpdateDecorationUsecase,
    @inject(GetDecorationByIdUsecase) protected readonly getByIdUsecase: GetDecorationByIdUsecase,
    @inject(GetDecorationByKeyUsecase) protected readonly getDecorationByKeyUsecase: GetDecorationByKeyUsecase,
    @inject(DeleteDecorationUsecase) protected readonly deleteUsecase: DeleteDecorationUsecase,
    @inject(ListAvailableDecorationsUsecase)
    protected readonly listAvailableDecorationsUsecase: ListAvailableDecorationsUsecase,
  ) {
    super();
  }

  public async listAvailableDecorations(req: Request, res: Response): Promise<ApiResult<DecorationEntity[]>> {
    const account = res.locals.account as AccountEntity;
    const usecaseResult = await this.listAvailableDecorationsUsecase.perform(account.id);
    const data = this.adapter.serializeList(usecaseResult.payload);
    return { status: HttpStatus.Ok, data, metadata: usecaseResult.metadata };
  }

  public async getByKey(req: Request): Promise<ApiResult<DecorationEntity>> {
    const entity = await this.getDecorationByKeyUsecase.perform(req.params.key);
    if (!entity) {
      throw new EntityNotFoundControllerException(`key: ${req.params.key}`);
    }

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data };
  }
}
