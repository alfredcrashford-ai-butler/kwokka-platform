import { AccessRightEntity } from '@kwokka/entities';
import { AccessRightMockRepository } from '../../../test/mocks/access-right-mock.repository';
import { GetAccessRightByIdUsecase } from './get-access-right-by-id.usecase';

describe(GetAccessRightByIdUsecase, () => {
  let usecase: GetAccessRightByIdUsecase;
  let repo: AccessRightMockRepository;

  beforeEach(() => {
    repo = new AccessRightMockRepository();
    usecase = new GetAccessRightByIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns existing access right', async () => {
    const accessRight = new AccessRightEntity({ id: '12345', name: 'AccessRight' });
    repo.find.mockResolvedValue(accessRight);

    const result = await usecase.perform('12345');

    expect(repo.find).toBeCalled();
    expect(result).toEqual(accessRight);
  });

  it('returns null when an access right does not exist', async () => {
    repo.find.mockResolvedValue(null);

    const result = await usecase.perform('12345');

    expect(result).toEqual(null);
  });
});
