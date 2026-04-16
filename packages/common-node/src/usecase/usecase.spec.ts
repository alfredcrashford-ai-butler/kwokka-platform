import { UsecaseException } from './usecase';

describe(UsecaseException, () => {
  it('exists', () => {
    expect(UsecaseException).toBeTruthy();
  });

  it('works', () => {
    expect(new UsecaseException('code', 'message')).toBeTruthy();
  });
});
