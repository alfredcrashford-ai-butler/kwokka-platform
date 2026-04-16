import { inject, injectable } from 'inversify';
import { DecorationEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { DecorationUsecaseValidations } from './decoration-usecase-validations';
import { DecorationRepository } from '../ports';

@injectable()
export class CreateDecorationUsecase implements Usecase {
  public constructor(
    @inject(DecorationRepository) private decorationRepository: DecorationRepository,
  ) {}

  public async perform(decoration: DecorationEntity): Promise<DecorationEntity> {
    decoration.key = decoration.key.trim();
    await DecorationUsecaseValidations.validateUniqueKey(this.decorationRepository, decoration.key);

    return await this.decorationRepository.create(decoration);
  }
}
