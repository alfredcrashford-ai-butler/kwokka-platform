import { inject, injectable } from 'inversify';
import { DecorationEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { DecorationRepository } from '../ports';
import { DecorationUsecaseValidations } from './decoration-usecase-validations';

@injectable()
export class UpdateDecorationUsecase implements Usecase {
  public constructor(@inject(DecorationRepository) private decorationRepository: DecorationRepository) {}

  public async perform(id: string, decoration: Partial<DecorationEntity>): Promise<DecorationEntity> {
    await DecorationUsecaseValidations.validateExists(this.decorationRepository, id);
    DecorationUsecaseValidations.validateNoApplicationAccountId(decoration);
    if (decoration.key) {
      await DecorationUsecaseValidations.validateUniqueKey(this.decorationRepository, decoration.key, id);
    }
    return await this.decorationRepository.update({ filter: { id } }, decoration);
  }
}
