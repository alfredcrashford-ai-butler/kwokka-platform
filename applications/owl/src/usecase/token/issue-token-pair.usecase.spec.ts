import { AccessRightEntity, AccessTokenEntity, AccountEntity, AccountEntityType } from '@kwokka/entities';
import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';
import { IssueTokenPairUsecase } from './issue-token-pair.usecase';
import { GetAccessRightsForAccountUsecase } from '../access-right/get-access-rights-for-account.usecase';

class GetAccessRightsForAccountMockUsecase extends GetAccessRightsForAccountUsecase {
  public constructor() {
    super(null, null, null, null);
  }

  public override perform = jest.fn();
}

describe(IssueTokenPairUsecase, () => {
  let usecase: IssueTokenPairUsecase;
  let repo: TokenMockRepository;
  let getAccessRightsForAccountUsecase: GetAccessRightsForAccountMockUsecase;

  beforeEach(() => {
    repo = new TokenMockRepository();
    getAccessRightsForAccountUsecase = new GetAccessRightsForAccountMockUsecase();
    usecase = new IssueTokenPairUsecase(repo, getAccessRightsForAccountUsecase);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns token pair using repo with access rights from GetAccessRightsForAccountMockUsecase', async () => {
    const credentialId = 'cred';
    const account = new AccountEntity({ id: 'acc', type: AccountEntityType.User, isActive: true, isVerified: true });
    repo.create.mockImplementation(async (token) => token);
    const accessRight1 = new AccessRightEntity({ id: '1', name: 'Eat' });
    const accessRight2 = new AccessRightEntity({ id: '2', name: 'Pray' });
    getAccessRightsForAccountUsecase.perform.mockResolvedValue([accessRight1, accessRight2]);

    const result = await usecase.perform(account, credentialId);

    expect(result.access).toBeInstanceOf(AccessTokenEntity);
    expect(result.access.accountId).toEqual(account.id);
    expect(result.access.credentialId).toEqual(credentialId);
    expect(result.access.content.rights).toEqual(['Eat', 'Pray']);
    expect(result.refresh.accountId).toEqual(account.id);
    expect(result.refresh.credentialId).toEqual(credentialId);
    expect(result.access.correlationId).toEqual(result.refresh.correlationId);
    expect(result.access.expiresAt.getTime()).toBeLessThan(result.refresh.expiresAt.getTime());
  });

  it('uses correlationId when provided for token pair', async () => {
    const correlationId = 'correlation';
    const account = new AccountEntity({ id: 'acc', type: AccountEntityType.User, isActive: true, isVerified: true });
    repo.create.mockImplementation(async (token) => token);
    getAccessRightsForAccountUsecase.perform.mockResolvedValue([]);

    const result = await usecase.perform(account, 'cred', correlationId);

    expect(result.access.correlationId).toEqual(correlationId);
    expect(result.access.correlationId).toEqual(result.refresh.correlationId);
  });
});
