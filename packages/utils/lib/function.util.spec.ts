import { FunctionUtil } from './function.util';

describe(FunctionUtil, () => {
  it('exists', () => {
    expect(FunctionUtil).toBeTruthy();
  });

  describe('withRetry()', () => {
    it('exists', () => {
      expect(FunctionUtil.withRetry).toBeInstanceOf(Function);
    });

    it('exists', () => {
      const originalFn = jest.fn().mockImplementation((attempt: number) => {
        throw new Error(`attempt:${attempt}`);
      });
      const withRetryFn = FunctionUtil.withRetry(originalFn, 5);

      expect(withRetryFn).toThrow(new Error('attempt:5'));
      expect(originalFn).toHaveBeenCalledTimes(5);
    });
  });

  describe('throttle()', () => {
    it('exists', () => {
      expect(FunctionUtil.throttle).toBeInstanceOf(Function);
    });

    it('does not allow to call function during throttle period', () => {
      const original = jest.fn();
      const throttled = FunctionUtil.throttle(original, 1000);
      jest.useFakeTimers();

      throttled();
      jest.advanceTimersByTime(500);
      throttled();
      throttled();
      throttled();
      jest.advanceTimersByTime(500);
      throttled();

      expect(original).toHaveBeenCalledTimes(2);
      jest.useRealTimers();
    });
  });

  describe('debounce()', () => {
    it('exists', () => {
      expect(FunctionUtil.debounce).toBeInstanceOf(Function);
    });

    it('does not allow to call function during debounce period', () => {
      const original = jest.fn();
      const debounced = FunctionUtil.debounce(original, 1000);
      jest.useFakeTimers();

      debounced();
      jest.advanceTimersByTime(1000);
      debounced();
      jest.advanceTimersByTime(500);
      debounced();
      jest.advanceTimersByTime(1000);

      expect(original).toHaveBeenCalledTimes(2);
      jest.useRealTimers();
    });
  });

  describe('memoize()', () => {
    it('exists', () => {
      expect(FunctionUtil.memoize).toBeInstanceOf(Function);
    });

    it('does not call the original function second time when called with same argument second time', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const original = jest.fn().mockImplementation((arg) => Math.random());
      const memoized = FunctionUtil.memoize(original);

      const result1 = memoized('arg');
      const result2 = memoized('arg');

      expect(result1).toEqual(result2);
      expect(original).toHaveBeenCalledTimes(1);
    });

    it('calls the original function for different arguments', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const original = jest.fn().mockImplementation((arg) => Math.random());
      const memoized = FunctionUtil.memoize(original);

      const result1 = memoized('arg1');
      const result2 = memoized('arg2');

      expect(result1).not.toEqual(result2);
      expect(original).toHaveBeenCalledTimes(2);
    });
  });
});
