import { inject, injectable } from 'inversify';
import { AccessRoleEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { AccessRoleRepository } from '../ports/access-role.repository';

@injectable()
export class ListAccessRolesUsecase implements Usecase {
  public constructor(@inject(AccessRoleRepository) private accessRoleRepository: AccessRoleRepository) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<AccessRoleEntity>> {
    return await this.accessRoleRepository.list({ offset, limit });
  }
}
