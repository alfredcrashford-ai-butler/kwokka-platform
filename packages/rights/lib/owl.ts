export enum OwlAccessRight {
  // Access Rights
  CreateAccessRight = 'CreateAccessRight',
  UpdateAccessRight = 'UpdateAccessRight',
  DeleteAccessRight = 'DeleteAccessRight',
  ReadAccessRight = 'ReadAccessRight',

  // Access Roles
  CreateAccessRole = 'CreateAccessRole',
  UpdateAccessRole = 'UpdateAccessRole',
  DeleteAccessRole = 'DeleteAccessRole',
  ReadAccessRole = 'ReadAccessRole',

  // Account Roles
  CreateAccountRoles = 'CreateAccountRoles',
  UpdateAccountRoles = 'UpdateAccountRoles',
  DeleteAccountRoles = 'DeleteAccountRoles',
  ReadAccountRoles = 'ReadAccountRoles',

  // Account Roles
  CreateAccountTypeRoles = 'CreateAccountTypeRoles',
  UpdateAccountTypeRoles = 'UpdateAccountTypeRoles',
  DeleteAccountTypeRoles = 'DeleteAccountTypeRoles',
  ReadAccountTypeRoles = 'ReadAccountTypeRoles',

  // Accounts
  CreateUserAccount = 'CreateUserAccount',
  CreateApplicationAccount = 'CreateApplicationAccount',
  CreateApplicationAdminAccount = 'CreateApplicationAdminAccount',
  UpdateAccount = 'UpdateAccount',
  DeleteAccount = 'DeleteAccount',
  DeleteOwnAccount = 'DeleteOwnAccount',
  ReadAccount = 'ReadAccount',
  ReadOwnAccount = 'ReadOwnAccount',
  ReadOwnCredential = 'ReadOwnCredential',

  // Credentials
  ReadCredential = 'ReadCredential',
  CreateCredential = 'CreateCredential',
  CreateOwnCredential = 'CreateOwnCredential',
  VerifyCredential = 'VerifyCredential',
  VerifyOwnCredential = 'VerifyOwnCredential',
  DeleteCredential = 'DeleteCredential',
  DeleteOwnCredential = 'DeleteOwnCredential',

  // Token & Access
  ReadToken = 'ReadToken',
  RevokeToken = 'RevokeToken',
  RevokeAccess = 'RevokeAccess',
  RefreshAccess = 'RefreshAccess',

  // Access management
  ManageAccess = 'ManageAccess',
  SetupAccess = 'SetupAccess',
}
