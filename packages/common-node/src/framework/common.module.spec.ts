import { SentryErrorTrackerService } from '../application';
import { CommonModule } from './common.module';

describe(CommonModule, () => {
  it('exists', () => {
    expect(CommonModule).toBeTruthy();
  });

  it('works', () => {
    expect(new CommonModule()).toBeTruthy();
  });

  describe('get components()', () => {
    it('returns list of components correctly', () => {
      const theModule = new CommonModule();
      expect(theModule.components).toBeInstanceOf(Array);
    });

    it('returns list with SentryErrorTracker for prod', () => {
      const oldEnv = process.env;
      process.env.NODE_ENV = 'production';
      const theModule = new CommonModule();
      expect(theModule.components.find((el) => el.implementer === SentryErrorTrackerService)).toBeTruthy();
      jest.resetModules();
      process.env = { ...oldEnv };
    });
  });
});
