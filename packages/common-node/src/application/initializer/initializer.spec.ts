import { injectable, injectFromBase } from 'inversify';
import { Initializer } from './initializer';
import { TestingModule } from '../../framework/module';
import { LoggerServiceMock } from '../../../test/__mocks__';
import { LoggerService } from '../service';

@injectFromBase()
@injectable()
class TestInitialier extends Initializer {
  protected intialize = jest.fn().mockResolvedValue(null);
}

describe(Initializer, () => {
  let testingModule: TestingModule;

  beforeEach(() => {
    testingModule = TestingModule.setup([
      { identifier: LoggerService, implementer: LoggerServiceMock },
      TestInitialier,
    ]);
  });

  it('exists', () => {
    expect(Initializer).toBeTruthy();
  });

  it('works', () => {
    expect(testingModule.container.get(TestInitialier)).toBeTruthy();
  });

  describe('execute()', () => {
    it('exists', () => {
      const initializer = testingModule.container.get<TestInitialier>(TestInitialier);
      expect(initializer.execute).toBeTruthy();
    });

    it('runs intialize method', async () => {
      const initializer = testingModule.container.get<TestInitialier>(TestInitialier);
      await initializer.execute();
      expect(initializer['intialize']).toHaveBeenCalledTimes(1);
    });

    it('throws error if initialize method throws error', async () => {
      const initializer = testingModule.container.get<TestInitialier>(TestInitialier);
      const error = new Error('test error');
      initializer['intialize'] = jest.fn().mockRejectedValue(error);

      await expect(initializer.execute()).rejects.toEqual(error);
    });
  });
});
