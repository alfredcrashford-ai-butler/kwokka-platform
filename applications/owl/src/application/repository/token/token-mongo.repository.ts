import { ObjectId } from 'bson';
import { inject, injectable, injectFromBase } from 'inversify';
import { Model as MongooseModel, Schema } from 'mongoose';
import { TokenEntity, TokenEntityType } from '@kwokka/entities';
import { ArrayUtil } from '@kwokka/utils';
import { DatabaseService, MongoRepository } from '@kwokka/common-node';
import { TokenRepository } from '../../../usecase';
import { TokenMongoAdapter } from './token-mongo.adapter';

@injectable()
@injectFromBase()
export class TokenMongoRepository extends MongoRepository<TokenEntity> implements TokenRepository {
  public readonly model: MongooseModel<any>;
  public readonly adapter: TokenMongoAdapter = new TokenMongoAdapter();
  private readonly modelName = 'token';

  public constructor(@inject(DatabaseService) private database: DatabaseService) {
    super();
    this.model = this.database.registerModel(this.modelName, this.schema);
  }

  public async findLastTokenInCorrelation(correlationId: string, type: TokenEntityType): Promise<TokenEntity> {
    const docs = await this.model.find({ correlationId, type }).sort({ createdAt: -1 }).limit(1).lean();
    const doc = ArrayUtil.first(docs);
    return this.adapter.deserialize(doc as any);
  }

  public override async create(token: TokenEntity): Promise<TokenEntity> {
    const tokenId = new ObjectId().toString();
    token.id = tokenId;
    token.content.jti = tokenId;
    return super.create(token);
  }

  private readonly schema: Schema = new Schema(
    {
      type: {
        type: String,
        enum: Object.values(TokenEntityType),
        required: true,
      },
      revokedAt: {
        type: Date,
      },
      content: {
        type: new Schema(
          {
            type: {
              type: String,
              enum: Object.values(TokenEntityType),
              required: true,
            },
            accountId: {
              type: Schema.Types.ObjectId,
              required: true,
            },
            correlationId: {
              type: String,
              required: true,
            },
            exp: {
              type: Number,
              required: true,
            },
            iat: {
              type: Number,
              required: true,
            },
            jti: {
              type: String,
              required: true,
            },
          },
          { _id: false, strict: false },
        ),
        required: true,
      },
      expiresAt: {
        type: Date,
      },
      correlationId: {
        type: String,
        required: true,
      },
      credentialId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      accountId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      deletedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  );
}
