import { inject, injectable } from 'inversify';
import { AccessRoleEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccessRoleRepository } from '../ports/access-role.repository';

@injectable()
export class GetAccessRoleByIdUsecase implements Usecase {
  public constructor(@inject(AccessRoleRepository) private accessRoleRepository: AccessRoleRepository) {}

  public async perform(id: string): Promise<AccessRoleEntity> {
    const accessRole = await this.accessRoleRepository.find({ filter: { id } });

    if (!accessRole) {
      return null;
    }

    return accessRole;
  }
}
