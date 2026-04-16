import type { PublicProps } from '@kwokka/utils';

export type Dto<T> = Omit<PublicProps<T>, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};
