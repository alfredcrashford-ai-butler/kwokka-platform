import { inject, injectable } from 'inversify';
import { AccessRoleEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccessRoleRepository } from '../ports/access-role.repository';
import { AccessRoleUsecaseValidations } from './access-role-usecase-validations';

@injectable()
export class DeleteAccessRoleUsecase implements Usecase {
  public constructor(@inject(AccessRoleRepository) private accessRoleRepository: AccessRoleRepository) {}

  public async perform(id: string): Promise<AccessRoleEntity> {
    await AccessRoleUsecaseValidations.validateAccessRoleExists(this.accessRoleRepository, id);
    return await this.accessRoleRepository.delete({ filter: { id } });
  }
}
