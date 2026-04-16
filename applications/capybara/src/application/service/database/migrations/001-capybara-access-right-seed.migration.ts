import { ObjectId } from 'bson';
import { Mongoose } from 'mongoose';
import { CapybaraAccessRight } from '@kwokka/rights';
import { AccountEntityType } from '@kwokka/entities';
import { AutoMigration, ConfigService } from '@kwokka/common-node';
import { EnvVarName } from '../../../env-var-name';

export class CapybaraAccessRightSeedMigration implements AutoMigration {
  private readonly owlMongodbUri: string;

  public constructor(private configService: ConfigService) {
    this.owlMongodbUri = this.configService.get(EnvVarName.OwlMongodbUri)
  }

  public connectToOwlDb(): Promise<Mongoose> {
    return new Promise((resolve, reject) => {
      const mongoose = new Mongoose();

      mongoose.connect(this.owlMongodbUri);
      mongoose.connection.on('connected', () => resolve(mongoose));
      mongoose.connection.on('error', (error: Error) => reject(error));
    });
  }

  public get id() {
    return 1;
  }

  public async run(): Promise<any> {
    const mongoose = await this.connectToOwlDb();
    const createdAt = new Date();

    const accessRights = [
      { _id: new ObjectId(), name: CapybaraAccessRight.CreateProfile, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.CreateOwnProfile, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.UpdateProfile, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.UpdateOwnProfile, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.DeleteProfile, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.DeleteOwnProfile, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.ReadOwnProfile, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.ReadProfile, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.CreateItem, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.ReadItem, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.UpdateItem, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.DeleteItem, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.GiveItemInstance, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.TakeItemInstance, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.ReadItemInstance, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.ReadOwnItemInstance, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.RunOwnItemInstanceAction, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.RunItemInstanceAction, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.CreateDecoration, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.ReadDecoration, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.UpdateDecoration, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.DeleteDecoration, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.CreateProfileDecorations, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.CreateOwnProfileDecorations, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.ReadProfileDecorations, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.UpdateOwnProfileDecorations, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.UpdateProfileDecorations, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.DeleteProfileDecorations, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.ManageItems, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.GiveApplicationItemInstance, createdAt },
      { _id: new ObjectId(), name: CapybaraAccessRight.TakeApplicationItemInstance, createdAt },
    ];

    const accessRoles = [
      {
        _id: new ObjectId(),
        name: 'OwnProfileManager',
        description: 'Can manage their own profile.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.ReadOwnProfile,
          CapybaraAccessRight.CreateOwnProfile,
          CapybaraAccessRight.UpdateOwnProfile,
          CapybaraAccessRight.DeleteOwnProfile,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'ProfileManager',
        description: 'Can create, update, and delete any profiles.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.CreateProfile,
          CapybaraAccessRight.UpdateProfile,
          CapybaraAccessRight.DeleteProfile,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'ProfileViewer',
        description: 'Can see profiles of any accounts.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.ReadProfile,
          CapybaraAccessRight.ReadProfileDecorations,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'ItemViewer',
        description: 'Can see items.',
        accessRightsIds: this.getIdsByNames(accessRights, [CapybaraAccessRight.ReadItem]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'ItemManager',
        description: 'Can manage items on the platform.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.CreateItem,
          CapybaraAccessRight.UpdateItem,
          CapybaraAccessRight.DeleteItem,
          CapybaraAccessRight.ManageItems,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'InventoryManager',
        description: 'Can manage inventory of any account.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.GiveItemInstance,
          CapybaraAccessRight.TakeItemInstance,
          CapybaraAccessRight.ReadItemInstance,
          CapybaraAccessRight.RunItemInstanceAction,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'ApplicationItemManager',
        description: 'Can manage items of application.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.GiveApplicationItemInstance,
          CapybaraAccessRight.TakeApplicationItemInstance,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'OwnInventoryManager',
        description: 'Can see own item instances and run their actions.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.ReadOwnItemInstance,
          CapybaraAccessRight.RunOwnItemInstanceAction,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'OwnProfileDecorationsManager',
        description: 'Can create and update own profile decorations.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.CreateOwnProfileDecorations,
          CapybaraAccessRight.UpdateOwnProfileDecorations,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'DecorationManager',
        description: 'Can manage decorations on the platform.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.CreateDecoration,
          CapybaraAccessRight.UpdateDecoration,
          CapybaraAccessRight.DeleteDecoration,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'DecorationViewer',
        description: 'Can see decorations.',
        accessRightsIds: this.getIdsByNames(accessRights, [CapybaraAccessRight.ReadDecoration]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'ProfileDecorationsManager',
        description: 'Can manage profile decorations on the platform.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          CapybaraAccessRight.CreateProfileDecorations,
          CapybaraAccessRight.UpdateProfileDecorations,
          CapybaraAccessRight.DeleteProfileDecorations,
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
            $each: this.getIdsByNames(accessRoles, [
              'OwnProfileManager',
              'OwnInventoryManager',
              'OwnProfileDecorationsManager',
              'ProfileViewer',
              'ItemViewer',
              'DecorationViewer',
              'ProfileManager',
              'ItemManager',
              'InventoryManager',
              'DecorationManager',
              'ProfileDecorationsManager',
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
              'OwnProfileManager',
              'OwnInventoryManager',
              'OwnProfileDecorationsManager',
              'ProfileViewer',
              'ItemViewer',
              'DecorationViewer',
              'ItemManager',
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
              'OwnProfileManager',
              'OwnInventoryManager',
              'OwnProfileDecorationsManager',
              // TODO: need to move requests from application to its own items only
              'InventoryManager',
              'ApplicationItemManager',
              'ProfileViewer',
              'ItemViewer',
              'DecorationViewer',
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
            $each: this.getIdsByNames(accessRoles, [
              'OwnProfileManager',
              'OwnInventoryManager',
              'OwnProfileDecorationsManager',
              'ProfileViewer',
              'ItemViewer',
              'DecorationViewer',
            ]),
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
