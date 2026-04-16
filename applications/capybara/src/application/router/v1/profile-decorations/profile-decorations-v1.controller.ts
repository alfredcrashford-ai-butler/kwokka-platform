import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { AccountEntity, ProfileDecorationsEntity } from '@kwokka/entities';
import { CrudController, ApiResult, EntityNotFoundControllerException, HttpStatus } from '@kwokka/common-node';
import { ProfileDecorationsV1Adapter } from './profile-decorations-v1.adapter';
import {
  CreateProfileDecorationsUsecase,
  UpdateProfileDecorationsUsecase,
  GetProfileByAccountIdUsecase,
  GetProfileDecorationsByProfileIdUsecase,
  DeleteProfileDecorationsUsecase,
} from '../../../../usecase';

@injectable()
@injectFromBase()
export class ProfileDecorationsV1Controller extends CrudController<ProfileDecorationsEntity> {
  protected readonly adapter: ProfileDecorationsV1Adapter = new ProfileDecorationsV1Adapter();

  public constructor(
    @inject(CreateProfileDecorationsUsecase) protected readonly createUsecase: CreateProfileDecorationsUsecase,
    @inject(UpdateProfileDecorationsUsecase) protected readonly updateUsecase: UpdateProfileDecorationsUsecase,
    @inject(GetProfileByAccountIdUsecase) protected readonly getProfileByAccountIdUsecase: GetProfileByAccountIdUsecase,
    @inject(GetProfileDecorationsByProfileIdUsecase)
    protected readonly getProfileDecorationsByProfileIdUsecase: GetProfileDecorationsByProfileIdUsecase,
    @inject(DeleteProfileDecorationsUsecase) protected readonly deleteUsecase: DeleteProfileDecorationsUsecase,
  ) {
    super();
  }

  public async createOwnProfileDecorations(req: Request, res: Response): Promise<ApiResult<ProfileDecorationsEntity>> {
    const account = res.locals.account as AccountEntity;
    const profile = await this.getProfileByAccountIdUsecase.perform(account.id);
    if (!profile) {
      throw new EntityNotFoundControllerException(`Profile for accountId: ${account.id}`);
    }

    let profileDecorations = this.adapter.deserialize(req.body);
    profileDecorations.profileId = profile.id;
    profileDecorations = await this.createUsecase.perform(profileDecorations);

    return { data: this.adapter.serialize(profileDecorations), status: HttpStatus.Ok };
  }

  public async patchOwnProfileDecorations(req: Request, res: Response): Promise<ApiResult<ProfileDecorationsEntity>> {
    const account = res.locals.account as AccountEntity;
    const profile = await this.getProfileByAccountIdUsecase.perform(account.id);
    if (!profile) {
      throw new EntityNotFoundControllerException(`Profile for accountId: ${account.id}`);
    }

    let profileDecorations = await this.getProfileDecorationsByProfileIdUsecase.perform(profile.id);
    if (!profileDecorations) {
      throw new EntityNotFoundControllerException(`Profile decorations for profileId: ${profile.id}`);
    }

    profileDecorations = await this.updateUsecase.perform(profileDecorations.id, req.body);

    return { data: this.adapter.serialize(profileDecorations), status: HttpStatus.Ok };
  }

  public async getProfileDecorationsByProfileId(req: Request): Promise<ApiResult<ProfileDecorationsEntity>> {
    const profileDecorations = await this.getProfileDecorationsByProfileIdUsecase.perform(req.params.profileId);
    if (!profileDecorations) {
      throw new EntityNotFoundControllerException(`Profile decorations for profileId: ${req.params.profileId}`);
    }

    return { data: this.adapter.serialize(profileDecorations), status: HttpStatus.Ok };
  }
}
