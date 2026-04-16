import { AuthService, DatabaseService, Module } from '@kwokka/common-node';
import { OwlMongoDatabaseService, OwlAuthService } from '../application';

export class OwlCommonOverridesModule extends Module {
  public get components() {
    return [
      { identifier: AuthService, implementer: OwlAuthService },
      { identifier: DatabaseService, implementer: OwlMongoDatabaseService },
    ];
  }
}
