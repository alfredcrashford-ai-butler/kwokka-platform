import { AccessRightEntity, AccessRoleEntity } from '@kwokka/entities';
import { AccessRightMockRepository } from '../../../test/mocks/access-right-mock.repository';
import { AccessRoleMockRepository } from '../../../test/mocks/access-role-mock.repository';
import { UsecaseException } from '@kwokka/common-node';
import { CreateAccessRoleUsecase } from './create-access-role.usecase';

describe(CreateAccessRoleUsecase, () => {
  let usecase: CreateAccessRoleUsecase;
  let accessRoleRepo: AccessRoleMockRepository;
  let accessRightRepo: AccessRightMockRepository;

  beforeEach(() => {
    accessRoleRepo = new AccessRoleMockRepository();
    accessRightRepo = new AccessRightMockRepository();
    usecase = new CreateAccessRoleUsecase(accessRoleRepo, accessRightRepo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('creates access role and stores it', async () => {
    accessRoleRepo.find.mockResolvedValue(null);
    accessRightRepo.listByIds.mockResolvedValue({
      payload: [
        new AccessRightEntity({ id: '1', name: 'EatPies' }),
        new AccessRightEntity({ id: '2', name: 'BakePies' }),
      ],
    });
    const accessRole = new AccessRoleEntity({ name: 'NewAccessRight', description: '', accessRightsIds: ['1', '2'] });

    await usecase.perform(accessRole);

    expect(accessRoleRepo.create).toBeCalled();
  });

  it('throws UsecaseException when an access role with same name already exist', async () => {
    accessRoleRepo.find.mockResolvedValue(
      new AccessRoleEntity({ name: 'NewAccessRight', description: '', accessRightsIds: ['1'] }),
    );
    const accessRole = new AccessRoleEntity({ name: 'NewAccessRight', description: '', accessRightsIds: ['1', '2'] });

    await expect(usecase.perform(accessRole)).rejects.toBeInstanceOf(UsecaseException);
  });

  it('throws UsecaseException when an access role is created with non-existing access rights', async () => {
    accessRoleRepo.find.mockResolvedValue(null);
    accessRightRepo.listByIds.mockResolvedValue({
      payload: [
        new AccessRightEntity({ id: '1', name: 'EatPies' }),
        new AccessRightEntity({ id: '2', name: 'BakePies' }),
      ],
    });
    const accessRole = new AccessRoleEntity({
      name: 'NewAccessRight',
      description: '',
      accessRightsIds: ['1', '2', '3'],
    });

    await expect(usecase.perform(accessRole)).rejects.toBeInstanceOf(UsecaseException);
  });
});
