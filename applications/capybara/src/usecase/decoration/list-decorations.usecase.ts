import { inject, injectable } from 'inversify';
import { DecorationEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { DecorationRepository } from '../ports/decoration.repository';

@injectable()
export class ListDecorationsUsecase implements Usecase {
  public constructor(@inject(DecorationRepository) private decorationRepository: DecorationRepository) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<DecorationEntity>> {
    return await this.decorationRepository.list({ offset, limit });
  }
}
