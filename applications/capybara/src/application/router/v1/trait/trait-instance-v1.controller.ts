import { inject, injectable, injectFromBase } from 'inversify';
import { Request, Response } from 'express';
import {
  ApiResult,
  Controller,
  ControllerException,
  EntityNotFoundControllerException,
  ErrorCode,
  HttpStatus,
} from '@kwokka/common-node';
import { AccountEntity, TraitEntity, TraitInstanceEntity } from '@kwokka/entities';
import { TraitInstanceV1Adapter } from './trait-instance-v1.adapter';
import {
  DeleteTraitInstanceUsecase,
  GetTraitByIdUsecase,
  GetTraitByKeyUsecase,
  ListTraitInstancesUsecase,
  UpdateTraitInstanceUsecase,
} from '../../../../usecase';
import { GetTraitInstanceUsecase } from '../../../../usecase/trait-instance/get-trait-instance.usecase';

@injectable()
@injectFromBase()
export class TraitInstanceV1Controller extends Controller {
  private readonly adapter: TraitInstanceV1Adapter = new TraitInstanceV1Adapter();

  public constructor(
    @inject(GetTraitByIdUsecase) private getTraitByIdUsecase: GetTraitByIdUsecase,
    @inject(GetTraitByKeyUsecase) private getTraitByKeyUsecase: GetTraitByKeyUsecase,
    @inject(GetTraitInstanceUsecase) private getTraitInstanceUsecase: GetTraitInstanceUsecase,
    @inject(UpdateTraitInstanceUsecase) private updateTraitInstanceUsecase: UpdateTraitInstanceUsecase,
    @inject(DeleteTraitInstanceUsecase) private deleteTraitInstanceUsecase: DeleteTraitInstanceUsecase,
    @inject(ListTraitInstancesUsecase) private listTraitInstancesUsecase: ListTraitInstancesUsecase,
  ) {
    super();
  }

  public async getByTraitKey(req: Request, res: Response): Promise<ApiResult<TraitInstanceEntity>> {
    const trait = await this.getTraitByKeyUsecase.perform(req.params.key);
    if (!trait) {
      throw new EntityNotFoundControllerException(`trait key: ${req.params.key}`);
    }

    const account = res.locals.account as AccountEntity;
    const traitInstance = await this.getTraitInstanceUsecase.perform(req.params.accountId, trait);
    this.validateTraitInstanceAccess(trait, traitInstance, account);

    return { status: HttpStatus.Ok, data: this.adapter.serialize(traitInstance) };
  }

  public async getByTraitId(req: Request, res: Response): Promise<ApiResult<TraitInstanceEntity>> {
    const trait = await this.getTraitByIdUsecase.perform(req.params.id);
    if (!trait) {
      throw new EntityNotFoundControllerException(`trait id: ${req.params.id}`);
    }

    const account = res.locals.account as AccountEntity;
    const traitInstance = await this.getTraitInstanceUsecase.perform(req.params.accountId, trait);
    this.validateTraitInstanceAccess(trait, traitInstance, account);

    return { status: HttpStatus.Ok, data: this.adapter.serialize(traitInstance) };
  }

  public async updateByTraitKey(req: Request, res: Response): Promise<ApiResult<TraitInstanceEntity>> {
    const trait = await this.getTraitByKeyUsecase.perform(req.params.key);
    if (!trait) {
      throw new EntityNotFoundControllerException(`trait key: ${req.params.key}`);
    }

    // TODO: implement access control list somehow

    const traitInstance = await this.updateTraitInstanceUsecase.perform(req.params.accountId, trait.id, req.body.value);

    return { status: HttpStatus.Ok, data: this.adapter.serialize(traitInstance) };
  }

  public async updateByTraitId(req: Request, res: Response): Promise<ApiResult<TraitInstanceEntity>> {
    const trait = await this.getTraitByIdUsecase.perform(req.params.id);
    if (!trait) {
      throw new EntityNotFoundControllerException(`trait id: ${req.params.id}`);
    }

    // TODO: implement access control list somehow

    const traitInstance = await this.updateTraitInstanceUsecase.perform(req.params.accountId, trait.id, req.body.value);

    return { status: HttpStatus.Ok, data: this.adapter.serialize(traitInstance) };
  }

  public async listByTraitId(req: Request): Promise<ApiResult<TraitInstanceEntity[]>> {
    const traitId = req.params.id;
    const sort = this.parseSort(req);
    const offset = this.parseOffset(req);
    const limit = this.parseLimit(req);
    const usecaseResult = await this.listTraitInstancesUsecase.perform({ traitId }, sort, offset, limit);
    const data = this.adapter.serializeList(usecaseResult.payload);
    return { status: HttpStatus.Ok, data, metadata: usecaseResult.metadata };
  }

  public async deleteByTraitId(req: Request, res: Response): Promise<ApiResult<TraitInstanceEntity>> {
    const trait = await this.getTraitByIdUsecase.perform(req.params.id);
    if (!trait) {
      throw new EntityNotFoundControllerException(`trait id: ${req.params.id}`);
    }

    // TODO: implement access control list somehow

    const traitInstance = await this.deleteTraitInstanceUsecase.perform(req.params.accountId, trait.id);

    return { status: HttpStatus.Ok, data: this.adapter.serialize(traitInstance) };
  }

  public async deleteByTraitKey(req: Request, res: Response): Promise<ApiResult<TraitInstanceEntity>> {
    const trait = await this.getTraitByKeyUsecase.perform(req.params.key);
    if (!trait) {
      throw new EntityNotFoundControllerException(`trait key: ${req.params.key}`);
    }

    // TODO: implement access control list somehow

    const traitInstance = await this.deleteTraitInstanceUsecase.perform(req.params.accountId, trait.id);

    return { status: HttpStatus.Ok, data: this.adapter.serialize(traitInstance) };
  }

  public async updateOwnByTraitId(req: Request, res: Response): Promise<ApiResult<TraitInstanceEntity>> {
    const trait = await this.getTraitByIdUsecase.perform(req.params.id);
    if (!trait) {
      throw new EntityNotFoundControllerException(`trait id: ${req.params.id}`);
    }

    const account = res.locals.account as AccountEntity;
    if (!trait.isOwnerEditable && trait.applicationAccountId !== account.id) {
      throw new ControllerException(ErrorCode.Forbidden, 'Can not update this trait instance', HttpStatus.Forbidden);
    }

    const traitInstance = await this.updateTraitInstanceUsecase.perform(account.id, trait.id, req.body.value);

    return { status: HttpStatus.Ok, data: this.adapter.serialize(traitInstance) };
  }

  public async updateOwnByTraitKey(req: Request, res: Response): Promise<ApiResult<TraitInstanceEntity>> {
    const trait = await this.getTraitByKeyUsecase.perform(req.params.key);
    if (!trait) {
      throw new EntityNotFoundControllerException(`trait key: ${req.params.key}`);
    }

    const account = res.locals.account as AccountEntity;

    const traitInstance = await this.updateTraitInstanceUsecase.perform(account.id, trait.id, req.body.value);
    if (!trait.isOwnerEditable && trait.applicationAccountId !== account.id) {
      throw new ControllerException(ErrorCode.Forbidden, 'Can not update this trait instance', HttpStatus.Forbidden);
    }

    return { status: HttpStatus.Ok, data: this.adapter.serialize(traitInstance) };
  }

  private validateTraitInstanceAccess(
    trait: TraitEntity,
    traitInstance: TraitInstanceEntity,
    account: AccountEntity,
  ): void {
    if (
      !trait.isPubliclyVisible &&
      trait.applicationAccountId !== account.id &&
      traitInstance.accountId !== account.id
    ) {
      throw new ControllerException(ErrorCode.Forbidden, 'Can not access this trait instance', HttpStatus.Forbidden);
    }
  }
}
