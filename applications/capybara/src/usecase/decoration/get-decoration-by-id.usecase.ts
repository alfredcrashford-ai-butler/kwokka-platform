import { inject, injectable } from 'inversify';
import { DecorationEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { DecorationRepository } from '../ports';

@injectable()
export class GetDecorationByIdUsecase implements Usecase {
  public constructor(@inject(DecorationRepository) private decorationRepository: DecorationRepository) {}

  public async perform(id: string): Promise<DecorationEntity> {
    const decoration = await this.decorationRepository.find({ filter: { id } });

    if (!decoration) {
      return null;
    }

    return decoration;
  }
}
