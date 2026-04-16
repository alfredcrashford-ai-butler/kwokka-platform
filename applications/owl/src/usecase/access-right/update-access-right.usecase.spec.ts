import { AccessRightEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { AccessRightMockRepository } from '../../../test/mocks/access-right-mock.repository';
import { UpdateAccessRightUsecase } from './update-access-right.usecase';

describe(UpdateAccessRightUsecase, () => {
  let usecase: UpdateAccessRightUsecase;
  let repo: AccessRightMockRepository;

  beforeEach(() => {
    repo = new AccessRightMockRepository();
    usecase = new UpdateAccessRightUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('updates access right and stores it', async () => {
    repo.find.mockResolvedValueOnce(new AccessRightEntity({ name: 'AccessRight' }));
    repo.find.mockResolvedValueOnce(null);

    await usecase.perform('12345', { name: 'NewAccessRight' });

    expect(repo.update).toBeCalled();
  });

  it('throws UsecaseException when an access right with same name already exist', async () => {
    repo.find.mockResolvedValueOnce(new AccessRightEntity({ id: '12345', name: 'AccessRight' }));
    repo.find.mockResolvedValueOnce(new AccessRightEntity({ id: '54321', name: 'NewAccessRight' }));

    await expect(usecase.perform('12345', { name: 'NewAccessRight' })).rejects.toBeInstanceOf(UsecaseException);
  });

  it('throws UsecaseException when an access right does not exist', async () => {
    repo.find.mockResolvedValue(null);

    await expect(usecase.perform('12345', { name: 'NewAccessRight' })).rejects.toBeInstanceOf(UsecaseException);
  });
});
