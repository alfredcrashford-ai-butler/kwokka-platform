import { TokenEntity, TokenEntityType } from '@kwokka/entities';
import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';
import { GetTokenByIdUsecase } from './get-token-by-id.usecase';

describe(GetTokenByIdUsecase, () => {
  let usecase: GetTokenByIdUsecase;
  let repo: TokenMockRepository;

  beforeEach(() => {
    repo = new TokenMockRepository();
    usecase = new GetTokenByIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns null if token could not be found', async () => {
    repo.find.mockResolvedValue(null);

    const result = await usecase.perform('token');

    expect(result).toEqual(null);
  });

  it('returns token using repo', async () => {
    const token = new TokenEntity({
      type: TokenEntityType.Access,
      content: null,
      accountId: 'acc',
      credentialId: 'cred',
      correlationId: '123',
    });
    repo.find.mockResolvedValue(token);

    const result = await usecase.perform('id');

    expect(result).toEqual(token);
    expect(repo.find).toBeCalledWith({ filter: { id: 'id' } });
  });
});
