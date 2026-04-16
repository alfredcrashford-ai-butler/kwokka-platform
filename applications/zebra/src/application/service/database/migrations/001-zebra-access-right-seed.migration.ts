import { Mongoose } from 'mongoose';
import { ObjectId } from 'bson';
import { ZebraAccessRight } from '@kwokka/rights';
import { AccountEntityType } from '@kwokka/entities';
import { AutoMigration, ConfigService } from '@kwokka/common-node';
import { EnvVarName } from '../../../env-var-name';

enum AccessRole {
  Player = 'Player',
  GameManager = 'GameManager',
  GameInstanceManager = 'GameInstanceManager',
}

export class ZebraAccessRightSeedMigration implements AutoMigration {
  private readonly owlMongodbUri: string;

  public constructor(private configService: ConfigService) {
    this.owlMongodbUri = this.configService.get(EnvVarName.OwlMongodbUri);
  }

  public get id() {
    return 1;
  }

  public async run(): Promise<any> {
    const mongoose = await this.connectToOwlDb();
    const createdAt = new Date();

    const accessRights = [
      { _id: new ObjectId(), name: ZebraAccessRight.ReadGame, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.CreateGame, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.UpdateGame, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.DeleteGame, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.ReadLobby, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.CreateLobby, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.UpdateLobby, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.DeleteLobby, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.ReadGameInstance, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.CreateGameInstance, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.UpdateGameInstance, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.DeleteGameInstance, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.ManageGames, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.ManageGameInstances, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.ReadGameStats, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.GenerateConnectToken, createdAt },
      { _id: new ObjectId(), name: ZebraAccessRight.ValidateConnectToken, createdAt },
    ];

    const accessRoles = [
      {
        _id: new ObjectId(),
        name: AccessRole.Player,
        description: 'Can read games, lobbies and own game instances.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          ZebraAccessRight.ReadGame,
          ZebraAccessRight.ReadLobby,
          ZebraAccessRight.CreateGameInstance,
          ZebraAccessRight.ReadGameInstance,
          ZebraAccessRight.GenerateConnectToken,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: AccessRole.GameManager,
        description: 'Can create, update, and delete games and lobbies.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          ZebraAccessRight.CreateGame,
          ZebraAccessRight.UpdateGame,
          ZebraAccessRight.DeleteGame,
          ZebraAccessRight.CreateLobby,
          ZebraAccessRight.UpdateLobby,
          ZebraAccessRight.DeleteLobby,
          ZebraAccessRight.ManageGames,
          ZebraAccessRight.ReadGameStats,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: AccessRole.GameInstanceManager,
        description: 'Can create, update, and delete game instances.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          ZebraAccessRight.UpdateGameInstance,
          ZebraAccessRight.DeleteGameInstance,
          ZebraAccessRight.ManageGameInstances,
          ZebraAccessRight.ValidateConnectToken,
        ]),
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
            $each: this.getIdsByNames(accessRoles, [AccessRole.Player, AccessRole.GameManager, AccessRole.GameInstanceManager]),
          },
        },
      },
    );
    await mongoose.connection.db.collection('account-type-roles').updateOne(
      { type: AccountEntityType.ApplicationAdmin },
      {
        $addToSet: {
          accessRolesIds: {
            $each: this.getIdsByNames(accessRoles, [AccessRole.Player, AccessRole.GameInstanceManager]),
          },
        },
      },
    );
    await mongoose.connection.db.collection('account-type-roles').updateOne(
      { type: AccountEntityType.Application },
      {
        $addToSet: {
          accessRolesIds: {
            $each: this.getIdsByNames(accessRoles, [AccessRole.Player, AccessRole.GameInstanceManager]),
          },
        },
      },
    );
    await mongoose.connection.db.collection('account-type-roles').updateOne(
      { type: AccountEntityType.User },
      {
        $addToSet: {
          accessRolesIds: {
            $each: this.getIdsByNames(accessRoles, [AccessRole.Player]),
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

  private connectToOwlDb(): Promise<Mongoose> {
    return new Promise((resolve, reject) => {
      const mongoose = new Mongoose();

      mongoose.connect(this.owlMongodbUri);
      mongoose.connection.on('connected', () => resolve(mongoose));
      mongoose.connection.on('error', (error: Error) => reject(error));
    });
  }
}
