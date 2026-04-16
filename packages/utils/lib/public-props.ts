export type PublicProps<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

export type PublicPropsArray<T extends any[]> = {
  [Index in keyof T]: PublicProps<T[Index]>;
};
