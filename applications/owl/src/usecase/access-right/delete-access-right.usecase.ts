import { inject, injectable } from 'inversify';
import { AccessRightEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccessRightRepository } from '../ports/access-right.repository';
import { AccessRightUsecaseValidations } from './access-right-usecase-validations';

@injectable()
export class DeleteAccessRightUsecase implements Usecase {
  public constructor(@inject(AccessRightRepository) private accessRightRepository: AccessRightRepository) {}

  public async perform(id: string): Promise<AccessRightEntity> {
    await AccessRightUsecaseValidations.validateAccessRightExists(this.accessRightRepository, id);
    return await this.accessRightRepository.delete({ filter: { id } });
  }
}
