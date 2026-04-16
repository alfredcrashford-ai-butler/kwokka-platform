import { inject, injectable } from 'inversify';
import { AccessRightEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccessRightRepository } from '../ports/access-right.repository';
import { AccessRightUsecaseValidations } from './access-right-usecase-validations';

@injectable()
export class UpdateAccessRightUsecase implements Usecase {
  public constructor(@inject(AccessRightRepository) private accessRightRepository: AccessRightRepository) {}

  public async perform(id: string, accessRight: Partial<AccessRightEntity>): Promise<AccessRightEntity> {
    await AccessRightUsecaseValidations.validateAccessRightExists(this.accessRightRepository, id);
    if (accessRight.name) {
      await AccessRightUsecaseValidations.validateUniqueName(this.accessRightRepository, accessRight, id);
    }

    return await this.accessRightRepository.update({ filter: { id } }, accessRight);
  }
}
