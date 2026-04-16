import { inject, injectable } from 'inversify';
import { AccessRoleEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccessRightRepository } from '../ports/access-right.repository';
import { AccessRoleRepository } from '../ports/access-role.repository';
import { AccessRoleUsecaseValidations } from './access-role-usecase-validations';

@injectable()
export class UpdateAccessRoleUsecase implements Usecase {
  public constructor(
    @inject(AccessRoleRepository) private accessRoleRepository: AccessRoleRepository,
    @inject(AccessRightRepository) private accessRightRepository: AccessRightRepository,
  ) {}

  public async perform(id: string, accessRole: Partial<AccessRoleEntity>): Promise<AccessRoleEntity> {
    await AccessRoleUsecaseValidations.validateAccessRoleExists(this.accessRoleRepository, id);

    if (accessRole.name) {
      await AccessRoleUsecaseValidations.validateUniqueName(this.accessRoleRepository, accessRole, id);
    }

    if (accessRole.accessRightsIds) {
      await AccessRoleUsecaseValidations.validateAccessRightsExist(this.accessRightRepository, accessRole);
    }

    return await this.accessRoleRepository.update({ filter: { id } }, accessRole);
  }
}
