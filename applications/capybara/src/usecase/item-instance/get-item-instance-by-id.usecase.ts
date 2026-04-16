import { inject, injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemInstanceRepository } from '../ports';

@injectable()
export class GetItemInstanceByIdUsecase implements Usecase {
  public constructor(@inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository) {}

  public async perform(id: string): Promise<ItemInstanceEntity> {
    const item = await this.itemInstanceRepository.find({ filter: { id } });
    return item || null;
  }
}
