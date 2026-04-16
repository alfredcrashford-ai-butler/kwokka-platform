import { inject, injectable } from 'inversify';
import { AccessRightEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccessRightRepository } from '../ports/access-right.repository';

@injectable()
export class GetAccessRightByIdUsecase implements Usecase {
  public constructor(@inject(AccessRightRepository) private accessRightRepository: AccessRightRepository) {}

  public async perform(id: string): Promise<AccessRightEntity> {
    const accessRight = await this.accessRightRepository.find({ filter: { id } });

    if (!accessRight) {
      return null;
    }

    return accessRight;
  }
}
