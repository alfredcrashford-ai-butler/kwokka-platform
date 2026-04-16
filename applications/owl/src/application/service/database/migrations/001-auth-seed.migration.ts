import { ObjectId } from 'bson';
import { Mongoose } from 'mongoose';
import { OwlAccessRight } from '@kwokka/rights';
import { AccountEntityType } from '@kwokka/entities';
import { AutoMigration } from '@kwokka/common-node';

export class AuthSeedMigration implements AutoMigration {
  public get id() {
    return 1;
  }

  public async run(mongoose: Mongoose): Promise<any> {
    const createdAt = new Date();
    const accessRights = [
      { _id: new ObjectId(), name: OwlAccessRight.CreateAccessRight, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.UpdateAccessRight, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.DeleteAccessRight, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.ReadAccessRight, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.CreateAccessRole, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.UpdateAccessRole, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.DeleteAccessRole, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.ReadAccessRole, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.CreateAccountTypeRoles, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.UpdateAccountTypeRoles, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.DeleteAccountTypeRoles, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.ReadAccountTypeRoles, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.CreateAccountRoles, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.UpdateAccountRoles, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.DeleteAccountRoles, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.ReadAccountRoles, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.CreateApplicationAccount, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.CreateApplicationAdminAccount, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.CreateUserAccount, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.DeleteOwnAccount, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.ReadOwnAccount, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.ReadOwnCredential, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.CreateOwnCredential, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.DeleteOwnCredential, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.RefreshAccess, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.UpdateAccount, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.DeleteAccount, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.ReadAccount, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.ReadCredential, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.CreateCredential, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.DeleteCredential, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.ReadToken, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.RevokeToken, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.RevokeAccess, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.ManageAccess, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.SetupAccess, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.VerifyCredential, createdAt },
      { _id: new ObjectId(), name: OwlAccessRight.VerifyOwnCredential, createdAt },
    ];

    const accessRoles = [
      {
        _id: new ObjectId(),
        name: 'AuthorizationManager',
        description: 'Has full control of access rights, access roles, and account type roles.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          OwlAccessRight.SetupAccess,
          OwlAccessRight.CreateAccessRight,
          OwlAccessRight.UpdateAccessRight,
          OwlAccessRight.DeleteAccessRight,
          OwlAccessRight.ReadAccessRight,
          OwlAccessRight.CreateAccessRole,
          OwlAccessRight.UpdateAccessRole,
          OwlAccessRight.DeleteAccessRole,
          OwlAccessRight.ReadAccessRole,
          OwlAccessRight.CreateAccountTypeRoles,
          OwlAccessRight.UpdateAccountTypeRoles,
          OwlAccessRight.DeleteAccountTypeRoles,
          OwlAccessRight.ReadAccountTypeRoles,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'ApplicationAccountProvider',
        description: 'Can create application and application admin accounts.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          OwlAccessRight.CreateApplicationAccount,
          OwlAccessRight.CreateApplicationAdminAccount,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'UserAccountProvider',
        description: 'Can create user accounts.',
        accessRightsIds: this.getIdsByNames(accessRights, [OwlAccessRight.CreateUserAccount]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'AccessManager',
        description: 'Can manage access in the whole platform, including reading, updating, and revoking operations.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          OwlAccessRight.ManageAccess,
          OwlAccessRight.UpdateAccount,
          OwlAccessRight.DeleteAccount,
          OwlAccessRight.ReadAccount,
          OwlAccessRight.ReadCredential,
          OwlAccessRight.CreateCredential,
          OwlAccessRight.DeleteCredential,
          OwlAccessRight.ReadToken,
          OwlAccessRight.RevokeToken,
          OwlAccessRight.RevokeAccess,
          OwlAccessRight.CreateAccountRoles,
          OwlAccessRight.UpdateAccountRoles,
          OwlAccessRight.DeleteAccountRoles,
          OwlAccessRight.ReadAccountRoles,
          OwlAccessRight.VerifyCredential,
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        name: 'OwnAccessManager',
        description: 'Can manage their own access.',
        accessRightsIds: this.getIdsByNames(accessRights, [
          OwlAccessRight.DeleteOwnAccount,
          OwlAccessRight.ReadOwnAccount,
          OwlAccessRight.ReadOwnCredential,
          OwlAccessRight.CreateOwnCredential,
          OwlAccessRight.DeleteOwnCredential,
          OwlAccessRight.VerifyOwnCredential,
          OwlAccessRight.RefreshAccess,
        ]),
        createdAt,
      },
    ];

    const accountTypeRoles = [
      {
        _id: new ObjectId(),
        type: AccountEntityType.PlatformAdmin,
        accessRolesIds: this.getIdsByNames(accessRoles, [
          'AuthorizationManager',
          'ApplicationAccountProvider',
          'UserAccountProvider',
          'AccessManager',
          'OwnAccessManager',
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        type: AccountEntityType.ApplicationAdmin,
        accessRolesIds: this.getIdsByNames(accessRoles, [
          'ApplicationAccountProvider',
          'UserAccountProvider',
          'OwnAccessManager',
        ]),
        createdAt,
      },
      {
        _id: new ObjectId(),
        type: AccountEntityType.Application,
        accessRolesIds: this.getIdsByNames(accessRoles, ['UserAccountProvider', 'OwnAccessManager']),
        createdAt,
      },
      {
        _id: new ObjectId(),
        type: AccountEntityType.User,
        accessRolesIds: this.getIdsByNames(accessRoles, ['OwnAccessManager']),
        createdAt,
      },
    ];

    await this.setupCollection('access-rights', mongoose, accessRights);
    await this.setupCollection('access-roles', mongoose, accessRoles);
    await this.setupCollection('account-type-roles', mongoose, accountTypeRoles);

    return { accessRights, accessRoles, accountTypeRoles };
  }

  private async setupCollection(name: string, mongoose: Mongoose, data: any[]): Promise<any> {
    await mongoose.connection.db.collection(name).deleteMany({});
    if (data?.length) {
      await mongoose.connection.db.collection(name).insertMany(data);
    }
  }

  private getIdsByNames(data: any[], names: string[]): ObjectId[] {
    return data.filter((el) => names.includes(el.name)).map((el) => el._id);
  }
}
