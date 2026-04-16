import { ObjectId } from 'bson';
import { Mongoose } from 'mongoose';
import { AutoMigration, ConfigService } from '@kwokka/common-node';
import { CapybaraAccessRight } from '@kwokka/rights';
import { AccountEntityType } from '@kwokka/entities';
import { EnvVarName } from '../../../env-var-name';

enum AccessRole {
  TraitReader = 'TraitReader',
  TraitManager = 'TraitManager',
  TraitInstanceManager = 'TraitInstanceManager',
  OwnTraitInstanceManager = 'OwnTraitInstanceManager',
}

export class TraitAccessRightMigration implements AutoMigration {
  private readonly owlMongodbUri: string;

  public constructor(private configService: ConfigService) {
    this.owlMongodbUri = this.configService.get(EnvVarName.OwlMongodbUri);
  }

  public get id() {
    return 3;
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
      { _id: new ObjectId(), name: CapybaraAccessRight.ReadTrait, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.DeleteTrait, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.CreateTrait, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.UpdateTrait, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.ReadTraitInstance, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.DeleteTraitInstance, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.UpdateTraitInstance, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.UpdateOwnTraitInstance, createdAt },
    ];

    const accessRoles = [
      {
        _id: new ObjectId(),
        name: AccessRole.TraitReader,
        description: 'Can read traits and trait instances.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.ReadTrait,
          CapybaraAccessRight.ReadTraitInstance,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: AccessRole.TraitManager,
        description: 'Can create, update, and delete any traits, can delete trait instances.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.CreateTrait,
          CapybaraAccessRight.UpdateTrait,
          CapybaraAccessRight.DeleteTrait,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: AccessRole.TraitInstanceManager,
        description: 'Can update and delete trait instances.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.DeleteTraitInstance,
          CapybaraAccessRight.UpdateTraitInstance,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: AccessRole.OwnTraitInstanceManager,
        description: 'Can update own trait instances.',
        accessRightsIds: this.getIdsByNames(accessRights, [CapybaraAccessRight.UpdateOwnTraitInstance]),
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
              AccessRole.TraitReader,
              AccessRole.TraitManager,
              AccessRole.TraitInstanceManager,
              AccessRole.OwnTraitInstanceManager,
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
              AccessRole.TraitReader,
              AccessRole.TraitInstanceManager,
              AccessRole.OwnTraitInstanceManager,
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
            $each: this.getIdsByNames(accessRoles, [
              AccessRole.TraitReader,
              AccessRole.TraitInstanceManager,
              AccessRole.OwnTraitInstanceManager,
            ]),
          },
        },
      },
    );
    await mongoose.connection.db.collection('account-type-roles').updateOne(
      { type: AccountEntityType.User },
      {
        $addToSet: {
          accessRolesIds: {
            $each: this.getIdsByNames(accessRoles, [AccessRole.TraitReader, AccessRole.OwnTraitInstanceManager]),
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
