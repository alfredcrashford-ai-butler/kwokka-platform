import { UsecaseDeepSearchParameter } from './deep-search';

describe('UsecaseDeepSearchParameter', () => {
  it('should accept a valid deep search parameter object', () => {
    const input: UsecaseDeepSearchParameter = {
      age: { min: 18, max: 30, neq: 27 },
      name: { eq: 'Alice' },
      createdAt: { min: new Date('2020-01-01'), max: new Date() },
      status: { neq: null },
      results: { nested: { eq: 'alice' } },
    };

    expect(true).toBe(true);
  });
});
