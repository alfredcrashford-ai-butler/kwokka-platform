import { Mongoose } from 'mongoose';
import { AutoMigration } from '@kwokka/common-node';
import { ObjectUtil } from '@kwokka/utils';

export class GameInstanceConnectionCleanupMigration implements AutoMigration {
  public get id() {
    return 2;
  }

  public async run(mongoose: Mongoose): Promise<any> {
    const res = await mongoose.connection.db
      .collection('game-instances')
      .updateMany({}, { $unset: { connection: '' } });

    return ObjectUtil.take(res, ['acknowledged', 'matchedCount', 'modifiedCount']);
  }
}
