import { Mongoose } from 'mongoose';
import { AutoMigration } from '@kwokka/common-node';
import { ObjectUtil } from '@kwokka/utils';

export class LobbyConfigMigration implements AutoMigration {
  public get id() {
    return 3;
  }

  public async run(mongoose: Mongoose): Promise<any> {
    const res = await mongoose.connection.db
      .collection('lobbies')
      .updateMany({}, { $rename: { defaultLobbySettings: 'config' } });

    return ObjectUtil.take(res, ['acknowledged', 'matchedCount', 'modifiedCount']);
  }
}
