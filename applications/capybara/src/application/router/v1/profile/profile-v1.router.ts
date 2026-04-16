import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { ProfileEntity } from '@kwokka/entities';
import { CapybaraAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { ProfileV1Controller } from './profile-v1.controller';
import { ProfileViewModel } from './profile-v1.view-model';

@injectable()
@injectFromBase()
export class ProfileV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(ProfileV1Controller) private controller: ProfileV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.CreateProfile]),
        this.validation.withViewModel(ProfileViewModel.Create),
      ],
      this.createProfile,
    );
    this.post(
      '/my',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.CreateOwnProfile]),
        this.validation.withViewModel(ProfileViewModel.CreateOwn),
      ],
      this.createOwnProfile,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadProfile]),
        this.validation.withViewModel(ProfileViewModel.List),
      ],
      this.listProfiles,
    );

    this.get('/my', [this.accessRightsMiddleware.get([CapybaraAccessRight.ReadOwnProfile])], this.getOwnProfile);
    this.get(
      '/account/:accountId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadProfile]),
        this.validation.withViewModel(ProfileViewModel.GetByAccountId),
      ],
      this.getProfileByAccountId,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadProfile]),
        this.validation.withViewModel(ProfileViewModel.GetById),
      ],
      this.getProfileById,
    );

    this.patch(
      '/my',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateOwnProfile]),
        this.validation.withViewModel(ProfileViewModel.PatchOwn),
      ],
      this.patchOwnProfile,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateProfile]),
        this.validation.withViewModel(ProfileViewModel.Patch),
      ],
      this.patchProfile,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.DeleteProfile]),
        this.validation.withViewModel(ProfileViewModel.Delete),
      ],
      this.deleteProfile,
    );
  }

  public createProfile = async (req: Request): Promise<ApiResult<ProfileEntity>> => {
    return this.controller.create(req);
  };

  public createOwnProfile = async (req: Request, res: Response): Promise<ApiResult<ProfileEntity>> => {
    return this.controller.createOwnProfile(req, res);
  };

  public listProfiles = async (req: Request): Promise<ApiResult<ProfileEntity[]>> => {
    return this.controller.list(req);
  };

  public patchProfile = async (req: Request): Promise<ApiResult<ProfileEntity>> => {
    return this.controller.patch(req);
  };

  public patchOwnProfile = async (req: Request, res: Response): Promise<ApiResult<ProfileEntity>> => {
    return this.controller.patchOwnProfile(req, res);
  };

  public deleteProfile = async (req: Request): Promise<ApiResult<ProfileEntity>> => {
    return this.controller.delete(req);
  };

  public getProfileById = async (req: Request): Promise<ApiResult<ProfileEntity>> => {
    return this.controller.getById(req);
  };

  public getProfileByAccountId = async (req: Request): Promise<ApiResult<ProfileEntity>> => {
    return this.controller.getProfileByAccountId(req);
  };

  public getOwnProfile = async (req: Request, res: Response): Promise<ApiResult<ProfileEntity>> => {
    return this.controller.getOwnProfile(req, res);
  };
}
