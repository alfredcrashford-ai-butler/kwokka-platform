import { ObjectId } from 'bson';
import { Mongoose } from 'mongoose';
import { AutoMigration, ConfigService } from '@kwokka/common-node';
import { CapybaraAccessRight } from '@kwokka/rights';
import { AccountEntityType } from '@kwokka/entities';
import { EnvVarName } from '../../../env-var-name';

enum AccessRole {
  ItemTradeReader = 'ItemTradeReader',
  ItemTradeManager = 'ItemTradeManager',
  OwnItemTradeExecutor = 'OwnItemTradeExecutor',
}

export class ItemTradeAccessRightMigration implements AutoMigration {
  private readonly owlMongodbUri: string;

  public constructor(private configService: ConfigService) {
    this.owlMongodbUri = this.configService.get(EnvVarName.OwlMongodbUri);
  }

  public get id() {
    return 4;
  }

  public connectToOwlDb(): Promise<Mongoose> {
    return new Promise((resolve, reject) => {
      const mongoose = new Mongoose();

      mongoose.connect(this.owlMongodbUri);
      mongoose.connection.on('connected', () => resolve(mongoose));
      mongoose.connection.on('error', (error: Error) => reject(error));
    });
  }

  public async run(): Promise<any> {
    const mongoose = await this.connectToOwlDb();
    const createdAt = new Date();

    const accessRights = [
      { _id: new ObjectId(), name: CapybaraAccessRight.ReadItemTrade, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.CreateItemTrade, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.UpdateItemTrade, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.DeleteItemTrade, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.RunOwnItemTrade, createdAt },
    ];

    const accessRoles = [
      {
        _id: new ObjectId(),
        name: AccessRole.ItemTradeReader,
        description: 'Can read item trades.',
        accessRightsIds: this.getIdsByNames(accessRights, [CapybaraAccessRight.ReadItemTrade]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: AccessRole.ItemTradeManager,
        description: 'Can create, update, and delete any item trades.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.CreateItemTrade,
          CapybaraAccessRight.UpdateItemTrade,
          CapybaraAccessRight.DeleteItemTrade,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: AccessRole.OwnItemTradeExecutor,
        description: 'Can run item trades for themself.',
        accessRightsIds: this.getIdsByNames(accessRights, [CapybaraAccessRight.RunOwnItemTrade]),
        createdAt,
      },
    ];

    await mongoose.connection.db.collection('access-rights').insertMany(accessRights as any[]);
    await mongoose.connection.db.collection('access-roles').insertMany(accessRoles as any[]);
    await mongoose.connection.db.collection('account-type-roles').updateOne(
      { type: AccountEntityType.PlatformAdmin },
      {
        $addToSet: {
          accessRolesIds: {
            $each: this.getIdsByNames(accessRoles, [
              AccessRole.ItemTradeReader,
              AccessRole.ItemTradeManager,
              AccessRole.OwnItemTradeExecutor,
            ]),
          },
        },
      },
    );
    await mongoose.connection.db.collection('account-type-roles').updateOne(
      { type: AccountEntityType.ApplicationAdmin },
      {
        $addToSet: {
          accessRolesIds: {
            $each: this.getIdsByNames(accessRoles, [
              AccessRole.ItemTradeReader,
              AccessRole.ItemTradeManager,
              AccessRole.OwnItemTradeExecutor,
            ]),
          },
        },
      },
    );
    await mongoose.connection.db.collection('account-type-roles').updateOne(
      { type: AccountEntityType.Application },
      {
        $addToSet: {
          accessRolesIds: {
            $each: this.getIdsByNames(accessRoles, [AccessRole.ItemTradeReader]),
          },
        },
      },
    );
    await mongoose.connection.db.collection('account-type-roles').updateOne(
      { type: AccountEntityType.User },
      {
        $addToSet: {
          accessRolesIds: {
            $each: this.getIdsByNames(accessRoles, [AccessRole.ItemTradeReader, AccessRole.OwnItemTradeExecutor]),
          },
        },
      },
    );

    await mongoose.disconnect();

    return { accessRights, accessRoles };
  }

  private getIdsByNames(data: any[], names: string[]): ObjectId[] {
    return data.filter((el) => names.includes(el.name)).map((el) => el._id);
  }
}
