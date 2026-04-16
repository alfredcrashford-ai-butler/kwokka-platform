import { AccessRoleEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { AccessRightRepository } from '../ports/access-right.repository';
import { AccessRoleRepository } from '../ports/access-role.repository';

export class AccessRoleUsecaseValidations {
  public static async validateUniqueName(
    repo: AccessRoleRepository,
    accessRole: Partial<AccessRoleEntity>,
    accessRoleId?: string,
  ): Promise<void> {
    const existingAccessRole = await repo.find({ filter: { name: accessRole.name } });
    if (existingAccessRole && (!accessRoleId || existingAccessRole.id !== accessRoleId)) {
      throw new UsecaseException(
        ExceptionCode.AccessRoleAlreadyExists,
        `Access role with name ${accessRole.name} already exist.`,
      );
    }
  }

  public static async validateAccessRightsExist(
    repo: AccessRightRepository,
    accessRole: Partial<AccessRoleEntity>,
  ): Promise<void> {
    const { payload: accessRights } = await repo.listByIds(accessRole.accessRightsIds);
    if (accessRights?.length !== accessRole?.accessRightsIds?.length) {
      const nonExistingIds = accessRole?.accessRightsIds.filter((id) => !accessRights.find((el) => el.id === id));
      throw new UsecaseException(
        ExceptionCode.AccessRightsDoNotExist,
        `Access rights with ids [${nonExistingIds}] do not exist.`,
      );
    }
  }

  public static async validateAccessRoleExists(repo: AccessRoleRepository, id: string): Promise<void> {
    const accessRole = await repo.find({ filter: { id } });
    if (!accessRole) {
      throw new UsecaseException(ExceptionCode.AccessRoleDoesNotExist, `Access role with id: ${id}] does not exist.`);
    }
  }
}
