import { inject, injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemInstanceRepository } from '../ports';

@injectable()
export class GetItemInstanceByItemIdUsecase implements Usecase {
  public constructor(@inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository) {}

  public async perform(itemId: string, accountId: string): Promise<ItemInstanceEntity> {
    const item = await this.itemInstanceRepository.find({ filter: { itemId, accountId } });
    return item || null;
  }
}
