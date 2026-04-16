import { AuthService, DefaultAuthService, DatabaseService, Module } from '@kwokka/common-node';
import { CapybaraMongoDatabaseService } from '../application';

export class CapybaraCommonOverridesModule extends Module {
  public get components() {
    return [
      { identifier: AuthService, implementer: DefaultAuthService },
      { identifier: DatabaseService, implementer: CapybaraMongoDatabaseService },
    ];
  }
}
