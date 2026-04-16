import { AccessRoleEntity } from '@kwokka/entities';
import { AccessRoleMockRepository } from '../../../test/mocks/access-role-mock.repository';
import { ListAccessRolesUsecase } from './list-access-roles.usecase';

describe(ListAccessRolesUsecase, () => {
  let usecase: ListAccessRolesUsecase;
  let repo: AccessRoleMockRepository;

  beforeEach(() => {
    repo = new AccessRoleMockRepository();
    usecase = new ListAccessRolesUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns access roles from the repository', async () => {
    const accessRole1 = new AccessRoleEntity({ name: 'PieEater', description: 'lorem', accessRightsIds: ['eat_pie'] });
    const accessRole2 = new AccessRoleEntity({
      name: 'PieAdmirer',
      description: 'lorem',
      accessRightsIds: ['admire_pie'],
    });
    repo.list.mockResolvedValue({ payload: [accessRole1, accessRole2] });

    const result = await usecase.perform(0, 50);

    expect(result.payload).toEqual([accessRole1, accessRole2]);
    expect(repo.list).toBeCalled();
  });
});
