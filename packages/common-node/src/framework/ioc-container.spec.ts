import { injectable } from 'inversify';
import { IocContainer } from './ioc-container';

@injectable()
abstract class ParentClass {}

@injectable()
class ChildClass extends ParentClass {}

@injectable()
class SomeOtherClass {}

describe(IocContainer, () => {
  it('exists', () => {
    expect(IocContainer).toBeTruthy();
  });

  describe('bindUnits()', () => {
    it('exists', () => {
      expect(new IocContainer().bindUnits).toBeTruthy();
    });

    it('works when using undefined', () => {
      const container = new IocContainer()
      expect(() => container.bindUnits(undefined as any)).not.toThrowError();
    });
  });

  describe('get()', () => {
    it('exists', () => {
      expect(new IocContainer().get).toBeTruthy();
    });

    it('returns previously binded unit', () => {
      const container = new IocContainer();
      container.bindUnits([{ identifier: ParentClass, implementer: ChildClass }, SomeOtherClass])
      expect(container.get(ParentClass)).toBeInstanceOf(ChildClass);
      expect(container.get(SomeOtherClass)).toBeInstanceOf(SomeOtherClass);
    });

    it('throws error if unit was not found', () => {
      const container = new IocContainer();
      expect(() => container.get('non existing')).toThrowError(Error);
    });
  });
});
