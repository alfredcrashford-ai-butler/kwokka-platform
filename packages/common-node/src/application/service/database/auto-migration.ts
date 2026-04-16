import { Mongoose } from 'mongoose';

export interface AutoMigration {
  id: number;
  run(mongoose: Mongoose): Promise<any>;
}
