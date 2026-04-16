import { AccessRightEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { AccessRightRepository } from '../ports/access-right.repository';

export class AccessRightUsecaseValidations {
  public static async validateUniqueName(
    repo: AccessRightRepository,
    accessRight: Partial<AccessRightEntity>,
    accessRightId?: string,
  ): Promise<void> {
    const existingAccessRight = await repo.find({ filter: { name: accessRight.name } });
    if (existingAccessRight && (!accessRightId || existingAccessRight.id !== accessRightId)) {
      throw new UsecaseException(
        ExceptionCode.AccessRightAlreadyExists,
        `Access right with name ${accessRight.name} already exist.`,
      );
    }
  }

  public static async validateAccessRightExists(repo: AccessRightRepository, id: string): Promise<void> {
    const accessRight = await repo.find({ filter: { id } });
    if (!accessRight) {
      throw new UsecaseException(ExceptionCode.AccessRightDoesNotExist, `Access right with id: ${id}] does not exist.`);
    }
  }
}
