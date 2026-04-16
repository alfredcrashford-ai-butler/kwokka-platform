import { inject, injectable } from 'inversify';
import { AccessRightEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccessRightRepository } from '../ports/access-right.repository';
import { AccessRightUsecaseValidations } from './access-right-usecase-validations';

@injectable()
export class CreateAccessRightUsecase implements Usecase {
  public constructor(@inject(AccessRightRepository) private accessRightRepository: AccessRightRepository) {}

  public async perform(accessRight: AccessRightEntity): Promise<AccessRightEntity> {
    await AccessRightUsecaseValidations.validateUniqueName(this.accessRightRepository, accessRight);

    return await this.accessRightRepository.create(accessRight);
  }
}
