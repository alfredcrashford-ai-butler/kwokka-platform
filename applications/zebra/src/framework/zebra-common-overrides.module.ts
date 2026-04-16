import { AuthService, DefaultAuthService, DatabaseService, Module } from '@kwokka/common-node';
import { ZebraMongoDatabaseService } from '../application';

export class ZebraCommonOverridesModule extends Module {
  public get components() {
    return [
      { identifier: AuthService, implementer: DefaultAuthService },
      { identifier: DatabaseService, implementer: ZebraMongoDatabaseService },
    ];
  }
}
