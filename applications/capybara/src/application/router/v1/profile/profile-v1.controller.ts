import { inject, injectable, injectFromBase } from 'inversify';
import { Response, Request } from 'express';
import { AccountEntity, ProfileEntity } from '@kwokka/entities';
import { CrudController, ApiResult, HttpStatus, EntityNotFoundControllerException } from '@kwokka/common-node';
import { ProfileV1Adapter } from './profile-v1.adapter';
import {
  ListProfilesUsecase,
  CreateProfileUsecase,
  UpdateProfileUsecase,
  GetProfileByIdUsecase,
  DeleteProfileUsecase,
  GetProfileByAccountIdUsecase,
} from '../../../../usecase';

@injectable()
@injectFromBase()
export class ProfileV1Controller extends CrudController<ProfileEntity> {
  protected readonly adapter: ProfileV1Adapter = new ProfileV1Adapter();

  public constructor(
    @inject(ListProfilesUsecase) protected readonly listUsecase: ListProfilesUsecase,
    @inject(CreateProfileUsecase) protected readonly createUsecase: CreateProfileUsecase,
    @inject(UpdateProfileUsecase) protected readonly updateUsecase: UpdateProfileUsecase,
    @inject(GetProfileByIdUsecase) protected readonly getByIdUsecase: GetProfileByIdUsecase,
    @inject(DeleteProfileUsecase) protected readonly deleteUsecase: DeleteProfileUsecase,
    @inject(GetProfileByAccountIdUsecase) protected readonly getProfileByAccountIdUsecase: GetProfileByAccountIdUsecase,
  ) {
    super();
  }

  public async createOwnProfile(req: Request, res: Response): Promise<ApiResult<ProfileEntity>> {
    let entity = this.adapter.deserialize(req.body);
    const account = res.locals.account as AccountEntity;
    entity.accountId = account.id;
    entity = await this.createUsecase.perform(entity);
    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data: data };
  }

  public async patchOwnProfile(req: Request, res: Response): Promise<ApiResult<ProfileEntity>> {
    const account = res.locals.account as AccountEntity;
    let entity = await this.getProfileByAccountIdUsecase.perform(account.id);
    if (!entity) {
      throw new EntityNotFoundControllerException(req.params.id);
    }

    entity = await this.updateUsecase.perform(entity.id, req.body);

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data: data };
  }

  public async getOwnProfile(req: Request, res: Response): Promise<ApiResult<ProfileEntity>> {
    const account = res.locals.account as AccountEntity;
    const entity = await this.getProfileByAccountIdUsecase.perform(account.id);
    if (!entity) {
      throw new EntityNotFoundControllerException(account.id);
    }

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data: data };
  }

  public async getProfileByAccountId(req: Request): Promise<ApiResult<ProfileEntity>> {
    const entity = await this.getProfileByAccountIdUsecase.perform(req.params.accountId);
    if (!entity) {
      return { status: HttpStatus.Ok, data: null };
    }

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data: data };
  }
}
