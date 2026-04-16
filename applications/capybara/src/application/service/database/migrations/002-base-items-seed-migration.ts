import { ObjectId } from 'bson';
import { Mongoose } from 'mongoose';
import {
  DecorationEntityType,
  ItemEntityActionEffectType,
  ItemEntityActionTrigger,
  ItemEntityRarity,
} from '@kwokka/entities';
import { AutoMigration } from '@kwokka/common-node';
import { ImageDecorationKey, BackgroundDecorationKey, ItemKey } from '../../../../usecase';

const BASE_DECORATIONS_KEYS = [
  BackgroundDecorationKey.Plank,
  BackgroundDecorationKey.MoltenStone,
  BackgroundDecorationKey.RunicBoard,
  BackgroundDecorationKey.AsureScroll,
  BackgroundDecorationKey.CyberPatrol,
  ImageDecorationKey.Carl,
  ImageDecorationKey.Shao,
  ImageDecorationKey.Eric,
  ImageDecorationKey.Jimmy,
  ImageDecorationKey.Kurio,
];

export class BaseItemsSeedMigration implements AutoMigration {
  public get id() {
    return 2;
  }

  public async run(mongoose: Mongoose): Promise<any> {
    const createdAt = new Date();

    const decorations = [
      {  _id: new ObjectId(), key: BackgroundDecorationKey.Plank, type: DecorationEntityType.Background, createdAt },
      {  _id: new ObjectId(), key: BackgroundDecorationKey.MoltenStone, type: DecorationEntityType.Background, createdAt },
      {  _id: new ObjectId(), key: BackgroundDecorationKey.RunicBoard, type: DecorationEntityType.Background, createdAt },
      {  _id: new ObjectId(), key: BackgroundDecorationKey.AsureScroll, type: DecorationEntityType.Background, createdAt },
      {  _id: new ObjectId(), key: BackgroundDecorationKey.CyberPatrol, type: DecorationEntityType.Background, createdAt },
      {  _id: new ObjectId(), key: ImageDecorationKey.Carl, type: DecorationEntityType.Image, createdAt },
      {  _id: new ObjectId(), key: ImageDecorationKey.Shao, type: DecorationEntityType.Image, createdAt },
      {  _id: new ObjectId(), key: ImageDecorationKey.Eric, type: DecorationEntityType.Image, createdAt },
      {  _id: new ObjectId(), key: ImageDecorationKey.Jimmy, type: DecorationEntityType.Image, createdAt },
      {  _id: new ObjectId(), key: ImageDecorationKey.Kurio, type: DecorationEntityType.Image, createdAt },
    ];

    const items = [
      {
        _id: new ObjectId(),
        key: ItemKey.RookiesBackpack,
        isTransferrable: false,
        actions: [
          {
            key: 'rookies_backpack_have',
            trigger: ItemEntityActionTrigger.Have,
            effects: [
              {
                type: ItemEntityActionEffectType.UnlockDecorations,
                settings: { decorationsIds: this.getIdsByKeys(decorations, BASE_DECORATIONS_KEYS) },
              },
            ],
          },
        ],
        tags: ['standard', 'rookie'],
        rarity: ItemEntityRarity.Common,
        createdAt,
      },
    ];

    await mongoose.connection.db.collection('decorations').insertMany(decorations as any[]);
    await mongoose.connection.db.collection('items').insertMany(items as any[]);
  }

  private getIdsByKeys(data: any[], keys: string[]): ObjectId[] {
    return data.filter((el) => keys.includes(el.key)).map((el) => el._id);
  }
}
