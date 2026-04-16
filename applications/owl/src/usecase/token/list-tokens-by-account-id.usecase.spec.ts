import { AccessTokenEntity, AccountEntityType, RefreshTokenEntity, TokenEntityType } from '@kwokka/entities';
import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';
import { ListTokensByAccountIdUsecase } from './list-tokens-by-account-id.usecase';

describe(ListTokensByAccountIdUsecase, () => {
  let usecase: ListTokensByAccountIdUsecase;
  let repo: TokenMockRepository;

  beforeEach(() => {
    repo = new TokenMockRepository();
    usecase = new ListTokensByAccountIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns tokens list from repo', async () => {
    const accountId = 'acc';
    const credentialId = 'cred';
    const correlationId = 'correlation';
    const shared = { accountId, correlationId, jti: 'id', exp: 0, iat: 0 };
    const token1 = new AccessTokenEntity({
      content: { ...shared, rights: [], type: TokenEntityType.Access, accountType: AccountEntityType.User },
      accountId,
      credentialId,
      correlationId,
    });
    const token2 = new RefreshTokenEntity({
      content: { ...shared, type: TokenEntityType.Refresh },
      accountId,
      credentialId,
      correlationId,
    });
    repo.list.mockResolvedValue({ payload: [token1, token2] });

    const result = await usecase.perform('acc', 0, 50);

    expect(result.payload).toEqual([token1, token2]);
    expect(repo.list).toBeCalledWith({ filter: { accountId }, offset: 0, limit: 50 });
  });
});
