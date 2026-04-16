import { AccessTokenEntity, RefreshTokenEntity, TokenEntityType } from '@kwokka/entities';
import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';
import { RevokeTokenByIdUsecase } from './revoke-token-by-id.usecase';

describe(RevokeTokenByIdUsecase, () => {
  let usecase: RevokeTokenByIdUsecase;
  let repo: TokenMockRepository;

  beforeEach(() => {
    repo = new TokenMockRepository();
    usecase = new RevokeTokenByIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns null if token could not be found', async () => {
    repo.update.mockResolvedValue(null);

    const result = await usecase.perform('token');

    expect(result).toEqual(null);
  });

  it('revokes token by id using repo', async () => {
    const accountId = 'acc';
    const credentialId = 'cred';
    const correlationId = 'correlation';
    const date = new Date(1726691951947);
    jest.spyOn(global, 'Date').mockReturnValue(date as any);
    const id = 'token';
    const token = new RefreshTokenEntity({
      id: '1',
      content: { accountId, correlationId, jti: 'id', exp: 0, iat: 0, type: TokenEntityType.Refresh },
      accountId,
      credentialId,
      correlationId,
    });
    repo.update.mockResolvedValue(token);

    await usecase.perform(id);

    expect(repo.update).toBeCalledWith({ filter: { id } }, { revokedAt: date });
  });
});
