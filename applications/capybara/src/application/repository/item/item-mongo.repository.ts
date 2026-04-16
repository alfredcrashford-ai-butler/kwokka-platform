import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import {
  DecorationEntity,
  ItemEntity,
  ItemEntityActionEffectType,
  ItemEntityActionTrigger,
  ItemEntityRarity,
} from '@kwokka/entities';
import { DatabaseService, MongoRepository, RepositoryFilter } from '@kwokka/common-node';
import { ItemRepository } from '../../../usecase';
import { ItemMongoAdapter } from './item-mongo.adapter';

@injectable()
@injectFromBase()
export class ItemMongoRepository extends MongoRepository<ItemEntity> implements ItemRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: ItemMongoAdapter;
  private readonly modelName = 'item';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
    this.adapter = new ItemMongoAdapter();
  }

  protected override formatFilter(filter: RepositoryFilter): RepositoryFilter {
    let ids = filter.ids as string[] || [];
    if (ids.length) {
      ids = Array.from(new Set(ids.filter(Boolean)));
      filter._id = { $in: ids };
      delete filter.ids;
    }

    let keys = filter.keys as string[] || [];
    if (keys.length) {
      keys = Array.from(new Set(keys.filter(Boolean)));
      filter.key = { $in: keys };
      delete filter.keys;
    }

    return super.formatFilter(filter);
  }

  public async removeDecorationFromItems(decoration: DecorationEntity): Promise<void> {
    await this.model.updateMany(
      { ['actions.effects.settings.decorationsIds']: { $in: [decoration.id] } },
      { $pull: { 'actions.$[].effects.$[].settings.decorationsIds': decoration.id } },
    );
  }

  public async removeItemFromOtherItems(item: ItemEntity): Promise<void> {
    await this.model.updateMany(
      { ['actions.effects.settings.items.itemId']: item.id },
      { $pull: { 'actions.$[].effects.$[].settings.items': { itemId: item.id } } },
    );
  }

  private readonly schema: Schema = new Schema(
    {
      key: {
        type: String,
        required: true,
      },
      applicationAccountId: {
        type: Schema.Types.ObjectId,
      },
      isTransferrable: {
        type: Boolean,
        default: true,
        required: true,
      },
      actions: {
        type: [
          new Schema(
            {
              trigger: {
                type: String,
                enum: Object.values(ItemEntityActionTrigger),
                required: true,
              },
              key: {
                type: String,
                required: true,
              },
              effects: [
                new Schema(
                  {
                    type: {
                      type: String,
                      enum: Object.values(ItemEntityActionEffectType),
                      required: true,
                    },
                    settings: {
                      type: Object,
                      required: true,
                    },
                  },
                  { _id: false },
                ),
              ],
            },
            { _id: false },
          ),
        ],
        required: true,
      },
      tags: {
        type: [String],
        default: [],
        required: true,
      },
      rarity: {
        type: String,
        enum: Object.values(ItemEntityRarity),
        required: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
