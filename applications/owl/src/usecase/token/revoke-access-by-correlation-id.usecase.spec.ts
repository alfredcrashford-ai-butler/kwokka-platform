import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';
import { RevokeAccessByCorrelationIdUsecase } from './revoke-access-by-correlation-id.usecase';

describe(RevokeAccessByCorrelationIdUsecase, () => {
  let usecase: RevokeAccessByCorrelationIdUsecase;
  let repo: TokenMockRepository;

  beforeEach(() => {
    repo = new TokenMockRepository();
    usecase = new RevokeAccessByCorrelationIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('revokes tokens by correlation id using repo', async () => {
    const date = new Date(1726691951947);
    jest.spyOn(global, 'Date').mockReturnValue(date as any);
    const correlationId = 'corr';

    await usecase.perform(correlationId);

    expect(repo.updateMany).toBeCalledWith({ filter: { correlationId, revokedAt: null } }, { revokedAt: date });
  });
});
