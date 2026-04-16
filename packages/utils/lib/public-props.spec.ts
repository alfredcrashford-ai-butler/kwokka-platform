import type { PublicProps, PublicPropsArray } from './public-props';

describe('PublicProps', () => {
  it('exists', () => {
    class TestClass {
      public constructor(
        public fieldA: string,
        public fieldB: string,
        private fieldC: string,
      ) {}

      public method(): void {}
    }

    const publicProps: PublicProps<TestClass> = new TestClass('a', 'b', 'c');

    expect(publicProps.fieldA).toEqual('a');
    expect(publicProps.fieldB).toEqual('b');
    // SHOULD FAIL TO COMPILE
    // expect(publicProps.fieldC).toEqual('c');
    // expect(() => publicProps.method()).not.toThrow();
  });
});

describe('PublicPropsArray', () => {
  it('exists', () => {
    class TestClass {
      public constructor(
        public fieldA: string,
        public fieldB: string,
        private fieldC: string,
      ) {}

      public method(): void {}
    }

    const publicProps: PublicPropsArray<TestClass[]> = [new TestClass('a', 'b', 'c'), new TestClass('d', 'e', 'f')];

    expect(publicProps[0].fieldA).toEqual('a');
    expect(publicProps[0].fieldB).toEqual('b');
    expect(publicProps[1].fieldA).toEqual('d');
    expect(publicProps[1].fieldB).toEqual('e');
    // SHOULD FAIL TO COMPILE
    // expect(publicProps[0].fieldC).toEqual('c');
    // expect(publicProps[1].fieldC).toEqual('f');
    // expect(() => publicProps[0].method()).not.toThrow();
    // expect(() => publicProps[1].method()).not.toThrow();
  });
});
