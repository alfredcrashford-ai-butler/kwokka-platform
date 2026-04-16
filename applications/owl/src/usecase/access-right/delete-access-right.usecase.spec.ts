import { AccessRightEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { AccessRightMockRepository } from '../../../test/mocks/access-right-mock.repository';
import { DeleteAccessRightUsecase } from './delete-access-right.usecase';

describe(DeleteAccessRightUsecase, () => {
  let usecase: DeleteAccessRightUsecase;
  let repo: AccessRightMockRepository;

  beforeEach(() => {
    repo = new AccessRightMockRepository();
    usecase = new DeleteAccessRightUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('deletes existing access right', async () => {
    repo.find.mockResolvedValue(new AccessRightEntity({ id: '12345', name: 'AccessRight' }));

    await usecase.perform('12345');

    expect(repo.delete).toBeCalled();
  });

  it('throws UsecaseException when an access right does not exist', async () => {
    repo.find.mockResolvedValue(null);

    await expect(usecase.perform('12345')).rejects.toBeInstanceOf(UsecaseException);
  });
});
