import { AccessRoleEntity } from '@kwokka/entities';
import { AccessRoleMockRepository } from '../../../test/mocks/access-role-mock.repository';
import { DeleteAccessRoleUsecase } from './delete-access-role.usecase';
import { UsecaseException } from '@kwokka/common-node';

describe(DeleteAccessRoleUsecase, () => {
  let usecase: DeleteAccessRoleUsecase;
  let repo: AccessRoleMockRepository;

  beforeEach(() => {
    repo = new AccessRoleMockRepository();
    usecase = new DeleteAccessRoleUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('calls repo delete method when there is existing access role', async () => {
    const accessRole = new AccessRoleEntity({
      id: '12345',
      name: 'PieEater',
      description: 'lorem',
      accessRightsIds: ['eat_pie'],
    });
    repo.find.mockResolvedValue(accessRole);
    repo.delete.mockResolvedValue(accessRole);

    const result = await usecase.perform('12345');

    expect(result).toEqual(accessRole);
    expect(repo.find).toBeCalled();
    expect(repo.delete).toBeCalledWith({ filter: { id: '12345' } });
  });

  it('throws UsecaseException when access role does not exist', async () => {
    repo.find.mockResolvedValue(null);

    await expect(usecase.perform('12345')).rejects.toBeInstanceOf(UsecaseException);
    expect(repo.delete).not.toBeCalled();
  });
});
