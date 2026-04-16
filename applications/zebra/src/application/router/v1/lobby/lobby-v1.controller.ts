import { inject, injectable, injectFromBase } from 'inversify';
import { Request } from 'express';
import { LobbyEntity } from '@kwokka/entities';
import { ApiResult, CrudController, EntityNotFoundControllerException, HttpStatus } from '@kwokka/common-node';
import { LobbyV1Adapter } from './lobby-v1.adapter';
import {
  ListLobbiesUsecase,
  CreateLobbyUsecase,
  UpdateLobbyUsecase,
  GetLobbyByIdUsecase,
  DeleteLobbyUsecase,
  GetLobbyByKeyUsecase,
} from '../../../../usecase';

@injectable()
@injectFromBase()
export class LobbyV1Controller extends CrudController<LobbyEntity> {
  protected readonly adapter: LobbyV1Adapter = new LobbyV1Adapter();

  public constructor(
    @inject(ListLobbiesUsecase) protected readonly listUsecase: ListLobbiesUsecase,
    @inject(CreateLobbyUsecase) protected readonly createUsecase: CreateLobbyUsecase,
    @inject(UpdateLobbyUsecase) protected readonly updateUsecase: UpdateLobbyUsecase,
    @inject(GetLobbyByIdUsecase) protected readonly getByIdUsecase: GetLobbyByIdUsecase,
    @inject(DeleteLobbyUsecase) protected readonly deleteUsecase: DeleteLobbyUsecase,
    @inject(GetLobbyByKeyUsecase) protected readonly getLobbyByKeyUsecase: GetLobbyByKeyUsecase,
  ) {
    super();
  }

  public async getByKey(req: Request): Promise<ApiResult<LobbyEntity>> {
    const entity = await this.getLobbyByKeyUsecase.perform(req.params.key);
    if (!entity) {
      throw new EntityNotFoundControllerException(`key: ${req.params.key}`);
    }

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data };
  }
}
