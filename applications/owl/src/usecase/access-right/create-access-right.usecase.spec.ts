import { AccessRightEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { AccessRightMockRepository } from '../../../test/mocks/access-right-mock.repository';
import { CreateAccessRightUsecase } from './create-access-right.usecase';

describe(CreateAccessRightUsecase, () => {
  let usecase: CreateAccessRightUsecase;
  let repo: AccessRightMockRepository;

  beforeEach(() => {
    repo = new AccessRightMockRepository();
    usecase = new CreateAccessRightUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('creates access right and stores it', async () => {
    repo.find.mockResolvedValue(null);
    const accessRight = new AccessRightEntity({ name: 'NewAccessRight' });

    await usecase.perform(accessRight);

    expect(repo.create).toBeCalled();
  });

  it('throws UsecaseException when an access right with same name already exist', async () => {
    repo.find.mockResolvedValue(new AccessRightEntity({ id: '12345', name: 'NewAccessRight' }));
    const accessRight = new AccessRightEntity({ name: 'NewAccessRight' });

    await expect(usecase.perform(accessRight)).rejects.toBeInstanceOf(UsecaseException);
  });
});
