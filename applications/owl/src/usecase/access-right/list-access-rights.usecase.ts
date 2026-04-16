import { inject, injectable } from 'inversify';
import { AccessRightEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { AccessRightRepository } from '../ports/access-right.repository';

@injectable()
export class ListAccessRightsUsecase implements Usecase {
  public constructor(@inject(AccessRightRepository) private accessRightRepository: AccessRightRepository) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<AccessRightEntity>> {
    return await this.accessRightRepository.list({ offset, limit });
  }
}
