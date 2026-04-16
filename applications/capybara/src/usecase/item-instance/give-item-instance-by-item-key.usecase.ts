import { inject, injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemInstanceUsecaseValidations } from './item-instance-usecase-validations';
import { ItemRepository } from '../ports';
import { GiveItemInstanceUsecase } from './give-item-instance.usecase';

@injectable()
export class GiveItemInstanceByItemKeyUsecase implements Usecase {
  public constructor(
    @inject(ItemRepository) private itemRepository: ItemRepository,
    @inject(GiveItemInstanceUsecase) private giveItemInstanceUsecase: GiveItemInstanceUsecase,
  ) {}

  public async perform(
    accountId: string,
    key: string,
    quantity: number,
    applicationAccountId?: string,
  ): Promise<ItemInstanceEntity> {
    const filter: any = { key };
    if (applicationAccountId) {
      filter.applicationAccountId = applicationAccountId;
    }
    const item = await ItemInstanceUsecaseValidations.validateItemExists(this.itemRepository, filter);
    return this.giveItemInstanceUsecase.perform(accountId, item.id, quantity, applicationAccountId);
  }
}
