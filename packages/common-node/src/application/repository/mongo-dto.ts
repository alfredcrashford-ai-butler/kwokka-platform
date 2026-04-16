import { PublicProps } from '@kwokka/utils';

export type MongoDTO<T> = Omit<PublicProps<T>, 'id'> & { _id: string };
