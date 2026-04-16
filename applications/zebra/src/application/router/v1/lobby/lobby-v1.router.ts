import { Request } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { LobbyEntity } from '@kwokka/entities';
import { ZebraAccessRight } from '@kwokka/rights';
import { AccessRightMiddleware, ApiResult, AuthMiddleware, Router, ValidationMiddleware } from '@kwokka/common-node';
import { LobbyV1Controller } from './lobby-v1.controller';
import { LobbyV1ViewModel } from './lobby-v1.view-model';

@injectable()
@injectFromBase()
export class LobbyV1Router extends Router {
  public constructor(
    @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
    @inject(AccessRightMiddleware) private accessRightsMiddleware: AccessRightMiddleware,
    @inject(LobbyV1Controller) private controller: LobbyV1Controller,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.use(this.authMiddleware);
    this.post(
      '/',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.CreateLobby]),
        this.validation.withViewModel(LobbyV1ViewModel.Create),
      ],
      this.createLobby,
    );

    this.get(
      '/',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadLobby]),
        this.validation.withViewModel(LobbyV1ViewModel.List),
      ],
      this.listLobbies,
    );

    this.get(
      '/key/:key',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadGame]),
        this.validation.withViewModel(LobbyV1ViewModel.GetByKey),
      ],
      this.getLobbyByKey,
    );

    this.get(
      '/:id',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.ReadLobby]),
        this.validation.withViewModel(LobbyV1ViewModel.GetById),
      ],
      this.getLobbyById,
    );

    this.patch(
      '/:id',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.UpdateLobby]),
        this.validation.withViewModel(LobbyV1ViewModel.Patch),
      ],
      this.patchLobby,
    );

    this.delete(
      '/:id',
      [
        this.accessRightsMiddleware.get([ZebraAccessRight.DeleteLobby]),
        this.validation.withViewModel(LobbyV1ViewModel.Delete),
      ],
      this.deleteLobby,
    );
  }

  public createLobby = async (req: Request): Promise<ApiResult<LobbyEntity>> => {
    return this.controller.create(req);
  };

  public listLobbies = async (req: Request): Promise<ApiResult<LobbyEntity[]>> => {
    return this.controller.list(req);
  };

  public patchLobby = async (req: Request): Promise<ApiResult<LobbyEntity>> => {
    return this.controller.patch(req);
  };

  public deleteLobby = async (req: Request): Promise<ApiResult<LobbyEntity>> => {
    return this.controller.delete(req);
  };

  public getLobbyById = async (req: Request): Promise<ApiResult<LobbyEntity>> => {
    return this.controller.getById(req);
  };

  public getLobbyByKey = async (req: Request): Promise<ApiResult<LobbyEntity>> => {
    return this.controller.getByKey(req);
  };
}
