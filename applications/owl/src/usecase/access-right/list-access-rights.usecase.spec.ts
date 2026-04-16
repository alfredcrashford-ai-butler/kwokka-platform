import { AccessRightEntity } from '@kwokka/entities';
import { AccessRightMockRepository } from '../../../test/mocks/access-right-mock.repository';
import { ListAccessRightsUsecase } from './list-access-rights.usecase';

describe(ListAccessRightsUsecase, () => {
  let usecase: ListAccessRightsUsecase;
  let repo: AccessRightMockRepository;

  beforeEach(() => {
    repo = new AccessRightMockRepository();
    usecase = new ListAccessRightsUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns access rights list from repo', async () => {
    const accessRight1 = new AccessRightEntity({ id: 'access_right_1', name: 'AccessRight1' });
    const accessRight2 = new AccessRightEntity({ id: 'access_right_2', name: 'AccessRight2' });
    repo.list.mockResolvedValue({ payload: [accessRight1, accessRight2] });

    const result = await usecase.perform(0, 50);

    expect(repo.list).toBeCalled();
    expect(result.payload).toEqual([accessRight1, accessRight2]);
  });
});
