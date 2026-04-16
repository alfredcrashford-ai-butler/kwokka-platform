import { injectable } from 'inversify';
import { InjectableUnit } from './ioc-container';
import { BootstrapModule, Module, TestingModule } from './module';

@injectable()
abstract class ClassA {}

@injectable()
class ClassB {}

describe(Module, () => {
  it('exists', () => {
    expect(Module).toBeTruthy();
  });

  describe('get components()', () => {
    it('returns empty array by default', () => {
      const TestModule = class extends Module {};
      const testModuleInstance = new TestModule();
      expect(testModuleInstance.components).toEqual([]);
    });
  });
});

describe(BootstrapModule, () => {
  it('exists', () => {
    expect(BootstrapModule).toBeTruthy();
  });

  it('combines components of this module and child modules', () => {
    const TestChildModule = class extends Module {
      public get components(): InjectableUnit[] {
        return [ClassA];
      }
    };

    const TestModule = class extends BootstrapModule {
      public get components(): InjectableUnit[] {
        return [ClassB];
      }

      public get modules(): InjectableUnit[] {
        return [new TestChildModule()];
      }

      public async bootstrap(): Promise<void> {}
    };
    const testModuleInstance = new TestModule();
    expect(testModuleInstance.container.get(ClassA)).toBeInstanceOf(ClassA);
    expect(testModuleInstance.container.get(ClassB)).toBeInstanceOf(ClassB);
  });

  describe('get modules()', () => {
    it('returns empty array by default', () => {
      const TestModule = class extends BootstrapModule {
        public async bootstrap(): Promise<void> {}
      };
      const testModuleInstance = new TestModule();
      expect(testModuleInstance.modules).toEqual([]);
    });
  });
});

describe(TestingModule, () => {
  it('exists', () => {
    expect(TestingModule).toBeTruthy();
  });

  it('binds components to the inner container', () => {
    const TargetModule = class extends TestingModule {
      public get components(): InjectableUnit[] {
        return [ClassA, ClassB];
      }
    };

    const targetModuleInstance = new TargetModule();
    expect(targetModuleInstance.container.get(ClassA)).toBeInstanceOf(ClassA);
    expect(targetModuleInstance.container.get(ClassB)).toBeInstanceOf(ClassB);
  });

  describe('get components()', () => {
    it('returns empty array by default', () => {
      const TargetModule = class extends TestingModule {
        public async bootstrap(): Promise<void> {}
      };
      const targetModuleInstance = new TargetModule();
      expect(targetModuleInstance.components).toEqual([]);
    });
  });
});
