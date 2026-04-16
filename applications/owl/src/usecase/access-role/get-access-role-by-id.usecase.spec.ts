import { AccessRoleEntity } from '@kwokka/entities';
import { AccessRoleMockRepository } from '../../../test/mocks/access-role-mock.repository';
import { GetAccessRoleByIdUsecase } from './get-access-role-by-id.usecase';

describe(GetAccessRoleByIdUsecase, () => {
  let usecase: GetAccessRoleByIdUsecase;
  let repo: AccessRoleMockRepository;

  beforeEach(() => {
    repo = new AccessRoleMockRepository();
    usecase = new GetAccessRoleByIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns access role from the repository', async () => {
    const accessRole = new AccessRoleEntity({ name: 'PieEater', description: 'lorem', accessRightsIds: ['eat_pie'] });
    repo.find.mockResolvedValue(accessRole);

    const result = await usecase.perform('12345');

    expect(result).toEqual(accessRole);
    expect(repo.find).toBeCalled();
  });

  it('returns null if access role is not found', async () => {
    repo.find.mockResolvedValue(undefined);

    const result = await usecase.perform('12345');

    expect(result).toEqual(null);
    expect(repo.find).toBeCalled();
  });
});
