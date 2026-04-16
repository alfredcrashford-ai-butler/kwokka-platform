import { Adapter } from './adapter';

class TestEntity {
  public constructor(
    public name: string,
    public age: number,
  ) {}
}

class AdapterTestClass extends Adapter<TestEntity> {
  public deserialize = jest.fn();
  public serialize = jest.fn();
}

describe(Adapter, () => {
  let adapter: AdapterTestClass;

  beforeEach(() => {
    adapter = new AdapterTestClass();
  });

  it('exists', () => {
    expect(adapter).toBeTruthy();
  });

  describe('deserializeList', () => {
    it('calls deserialize for each element', () => {
      const first = { name: 'John', age: 21 };
      const second = { name: 'Jane', age: 35 };
      const third = { name: 'Jack', age: 12 };
      const entities = [first, second, third];

      adapter.deserializeList(entities);

      expect(adapter.deserialize.mock.calls[0]).toEqual([first]);
      expect(adapter.deserialize.mock.calls[1]).toEqual([second]);
      expect(adapter.deserialize.mock.calls[2]).toEqual([third]);
    });

    it('does not call anything when provided empty array', () => {
      adapter.deserializeList([]);

      expect(adapter.deserialize).not.toBeCalled();
    });

    it('does not call anything when provided null or undefined', () => {
      adapter.deserializeList(null as never);
      adapter.deserializeList(undefined as never);

      expect(adapter.deserialize).not.toBeCalled();
    });
  });

  describe('serializeList', () => {
    it('calls serialize for each element', () => {
      const first = new TestEntity('John', 21);
      const second = new TestEntity('Jane', 35);
      const third = new TestEntity('Jack', 12);
      const entities = [first, second, third];

      adapter.serializeList(entities);

      expect(adapter.serialize.mock.calls[0]).toEqual([first]);
      expect(adapter.serialize.mock.calls[1]).toEqual([second]);
      expect(adapter.serialize.mock.calls[2]).toEqual([third]);
    });

    it('does not call anything when provided empty array', () => {
      adapter.serializeList([]);

      expect(adapter.serialize).not.toBeCalled();
    });

    it('does not call anything when provided null or undefined', () => {
      adapter.serializeList(null as never);
      adapter.serializeList(undefined as never);

      expect(adapter.serialize).not.toBeCalled();
    });
  });
});
