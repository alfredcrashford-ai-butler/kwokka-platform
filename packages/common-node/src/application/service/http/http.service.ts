import { injectable } from 'inversify';

export interface HttpParams {
  query?: object;
  headers?: object;
  body?: any;
}

@injectable()
export abstract class HttpService {
  public abstract get<T>(url: string, params?: HttpParams): Promise<T>;
  public abstract post<T>(url: string, params?: HttpParams): Promise<T>;
  public abstract put<T>(url: string, params?: HttpParams): Promise<T>;
  public abstract patch<T>(url: string, params?: HttpParams): Promise<T>;
  public abstract delete<T>(url: string, params?: HttpParams): Promise<T>;
}
