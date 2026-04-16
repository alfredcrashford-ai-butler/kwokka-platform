import { PublicProps, PublicPropsArray } from '@kwokka/utils';
import { HttpStatus } from './http-status';

export type ApiResult<T = any> = {
  status: HttpStatus;
  data: T extends any[] ? PublicPropsArray<T> : PublicProps<T>;
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    offset?: number;
    limit?: number;
    count?: number;
  };
};
