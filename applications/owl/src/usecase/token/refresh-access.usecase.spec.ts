import { AccountEntity, AccountEntityType, RefreshTokenEntity, TokenEntityType } from '@kwokka/entities';
import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';
import { RefreshAccessUsecase } from './refresh-access.usecase';
import { UsecaseException } from '@kwokka/common-node';

describe(RefreshAccessUsecase, () => {
  let usecase: RefreshAccessUsecase;
  let repo: TokenMockRepository;
  let revokeAccessByCorrelationIdUsecase: any;
  let issueTokenPairUsecase: any;
  let getAccountByIdUsecase: any;

  beforeEach(() => {
    repo = new TokenMockRepository();
    revokeAccessByCorrelationIdUsecase = { perform: jest.fn() };
    issueTokenPairUsecase = { perform: jest.fn() };
    getAccountByIdUsecase = { perform: jest.fn() };
    usecase = new RefreshAccessUsecase(
      repo,
      revokeAccessByCorrelationIdUsecase,
      issueTokenPairUsecase,
      getAccountByIdUsecase,
    );
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if refresh token is revoked', async () => {
    const accountId = 'acc';
    const credentialId = 'cred';
    const correlationId = 'correlation';
    const token = new RefreshTokenEntity({
      content: { accountId, correlationId, jti: 'id', exp: 0, iat: 0, type: TokenEntityType.Refresh },
      accountId,
      credentialId,
      correlationId,
      revokedAt: new Date(),
    });

    await expect(usecase.perform(token)).rejects.toBeInstanceOf(UsecaseException);
  });

  it('throws UsecaseException if refresh token is expired', async () => {
    const accountId = 'acc';
    const credentialId = 'cred';
    const correlationId = 'correlation';
    const token = new RefreshTokenEntity({
      content: { accountId, correlationId, jti: 'id', exp: 0, iat: 0, type: TokenEntityType.Refresh },
      accountId,
      credentialId,
      correlationId,
      expiresAt: new Date(Date.now() - 100000),
    });

    await expect(usecase.perform(token)).rejects.toBeInstanceOf(UsecaseException);
  });

  it('revokes all tokens in correlation but throws UsecaseException if it is not the last token', async () => {
    const accountId = 'acc';
    const credentialId = 'cred';
    const correlationId = 'correlation';
    const token = new RefreshTokenEntity({
      id: '1',
      content: { accountId, correlationId, jti: 'id', exp: 0, iat: 0, type: TokenEntityType.Refresh },
      accountId,
      credentialId,
      correlationId,
    });
    repo.findLastTokenInCorrelation.mockResolvedValue({ id: '2' });

    await expect(usecase.perform(token)).rejects.toBeInstanceOf(UsecaseException);
    expect(revokeAccessByCorrelationIdUsecase.perform).toBeCalledWith(correlationId);
  });

  it('revokes all tokens in correlation but throws UsecaseException if account is inactive', async () => {
    const accountId = 'acc';
    const credentialId = 'cred';
    const correlationId = 'correlation';
    const token = new RefreshTokenEntity({
      id: '1',
      content: { accountId, correlationId, jti: 'id', exp: 0, iat: 0, type: TokenEntityType.Refresh },
      accountId,
      credentialId,
      correlationId,
    });
    repo.findLastTokenInCorrelation.mockResolvedValue(token);
    const account = new AccountEntity({
      id: accountId,
      type: AccountEntityType.User,
      isActive: false,
      isVerified: true,
    });
    getAccountByIdUsecase.perform.mockResolvedValue(account);

    await expect(usecase.perform(token)).rejects.toBeInstanceOf(UsecaseException);
    expect(revokeAccessByCorrelationIdUsecase.perform).toBeCalledWith(correlationId);
  });

  it('revokes all tokens in correlation and issues new token pair', async () => {
    const accountId = 'acc';
    const credentialId = 'cred';
    const correlationId = 'correlation';
    const token = new RefreshTokenEntity({
      id: '1',
      content: { accountId, correlationId, jti: 'id', exp: 0, iat: 0, type: TokenEntityType.Refresh },
      accountId,
      credentialId,
      correlationId,
    });
    repo.findLastTokenInCorrelation.mockResolvedValue(token);
    const account = new AccountEntity({
      id: accountId,
      type: AccountEntityType.User,
      isActive: true,
      isVerified: true,
    });
    getAccountByIdUsecase.perform.mockResolvedValue(account);

    await usecase.perform(token);

    expect(revokeAccessByCorrelationIdUsecase.perform).toBeCalledWith(correlationId);
    expect(issueTokenPairUsecase.perform).toBeCalledWith(account, credentialId, correlationId);
  });
});
