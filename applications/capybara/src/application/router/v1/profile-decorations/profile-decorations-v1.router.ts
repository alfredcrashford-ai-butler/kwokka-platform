import { Request, Response } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { ProfileDecorationsEntity } from '@kwokka/entities';
import { CapybaraAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { ProfileDecorationsV1ViewModel } from './profile-decorations-v1.view-model';
import { ProfileDecorationsV1Controller } from './profile-decorations-v1.controller';

@injectable()
@injectFromBase()
export class ProfileDecorationsV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(ProfileDecorationsV1Controller) private controller: ProfileDecorationsV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.CreateProfileDecorations]),
        this.validation.withViewModel(ProfileDecorationsV1ViewModel.Create),
      ],
      this.createProfileDecorations,
    );

    this.post(
      '/my',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.CreateOwnProfileDecorations]),
        this.validation.withViewModel(ProfileDecorationsV1ViewModel.CreateOwn),
      ],
      this.createOwnProfileDecorations,
    );

    this.get(
      '/profile/:profileId',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.ReadProfileDecorations]),
        this.validation.withViewModel(ProfileDecorationsV1ViewModel.GetByProfileId),
      ],
      this.getProfileDecorationsByProfileId,
    );

    this.patch(
      '/my',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateOwnProfileDecorations]),
        this.validation.withViewModel(ProfileDecorationsV1ViewModel.PatchOwn),
      ],
      this.patchOwnProfileDecorations,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.UpdateProfileDecorations]),
        this.validation.withViewModel(ProfileDecorationsV1ViewModel.Patch),
      ],
      this.patchProfileDecorations,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([CapybaraAccessRight.DeleteProfileDecorations]),
        this.validation.withViewModel(ProfileDecorationsV1ViewModel.Delete),
      ],
      this.deleteProfileDecorations,
    );
  }

  public createProfileDecorations = async (req: Request): Promise<ApiResult<ProfileDecorationsEntity>> => {
    return this.controller.create(req);
  };

  public createOwnProfileDecorations = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<ProfileDecorationsEntity>> => {
    return this.controller.createOwnProfileDecorations(req, res);
  };

  public patchProfileDecorations = async (req: Request): Promise<ApiResult<ProfileDecorationsEntity>> => {
    return this.controller.patch(req);
  };

  public patchOwnProfileDecorations = async (
    req: Request,
    res: Response,
  ): Promise<ApiResult<ProfileDecorationsEntity>> => {
    return this.controller.patchOwnProfileDecorations(req, res);
  };

  public deleteProfileDecorations = async (req: Request): Promise<ApiResult<ProfileDecorationsEntity>> => {
    return this.controller.delete(req);
  };

  public getProfileDecorationsByProfileId = async (req: Request): Promise<ApiResult<ProfileDecorationsEntity>> => {
    return this.controller.getProfileDecorationsByProfileId(req);
  };
}
