import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';
import { RevokeAccessByAccountIdUsecase } from './revoke-access-by-account-id.usecase';

describe(RevokeAccessByAccountIdUsecase, () => {
  let usecase: RevokeAccessByAccountIdUsecase;
  let repo: TokenMockRepository;

  beforeEach(() => {
    repo = new TokenMockRepository();
    usecase = new RevokeAccessByAccountIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('revokes tokens by account id using repo', async () => {
    const date = new Date(1726691951947);
    jest.spyOn(global, 'Date').mockReturnValue(date as any);
    const accountId = 'acc';

    await usecase.perform(accountId);

    expect(repo.updateMany).toBeCalledWith({ filter: { accountId, revokedAt: null } }, { revokedAt: date });
  });
});
