import { AccessRoleEntity, AccessRightEntity } from '@kwokka/entities';
import { AccessRightMockRepository } from '../../../test/mocks/access-right-mock.repository';
import { AccessRoleMockRepository } from '../../../test/mocks/access-role-mock.repository';
import { UsecaseException } from '@kwokka/common-node';
import { UpdateAccessRoleUsecase } from './update-access-role.usecase';

describe(UpdateAccessRoleUsecase, () => {
  let usecase: UpdateAccessRoleUsecase;
  let accessRoleRepo: AccessRoleMockRepository;
  let accessRightRepo: AccessRightMockRepository;

  beforeEach(() => {
    accessRoleRepo = new AccessRoleMockRepository();
    accessRightRepo = new AccessRightMockRepository();
    usecase = new UpdateAccessRoleUsecase(accessRoleRepo, accessRightRepo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('updates access role and stores it', async () => {
    accessRoleRepo.find.mockResolvedValueOnce(
      new AccessRoleEntity({ name: 'PieEater', description: '', accessRightsIds: ['1'] }),
    );
    accessRoleRepo.find.mockResolvedValueOnce(null);
    accessRightRepo.listByIds.mockResolvedValue({
      payload: [
        new AccessRightEntity({ id: '1', name: 'EatPies' }),
        new AccessRightEntity({ id: '2', name: 'BakePies' }),
      ],
    });

    await usecase.perform('12345', { name: 'PieBaker', accessRightsIds: ['1', '2'] });

    expect(accessRoleRepo.update).toBeCalled();
  });

  it('throws UsecaseException when an access role with same name already exist', async () => {
    accessRoleRepo.find.mockResolvedValue(
      new AccessRoleEntity({ name: 'NewAccessRight', description: '', accessRightsIds: ['1'] }),
    );

    await expect(usecase.perform('12345', { name: 'NewAccessRight' })).rejects.toBeInstanceOf(UsecaseException);
  });

  it('throws UsecaseException when an access role is created with non-existing access rights', async () => {
    accessRightRepo.listByIds.mockResolvedValue([
      new AccessRightEntity({ id: '1', name: 'EatPies' }),
      new AccessRightEntity({ id: '2', name: 'BakePies' }),
    ]);

    await expect(usecase.perform('12345', { accessRightsIds: ['1', '2', '3'] })).rejects.toBeInstanceOf(
      UsecaseException,
    );
  });
});
