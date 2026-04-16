import axios, { AxiosError } from 'axios';
import { inject, injectable } from 'inversify';
import { LoggerService } from '../logger';
import { HttpParams, HttpService } from './http.service';

type AxiosRequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

@injectable()
export class AxiosHttpService extends HttpService {
  public constructor(@inject(LoggerService) private logger: LoggerService) {
    super();
  }

  public async get<T>(url: string, params?: HttpParams): Promise<T> {
    return this.request('get', url, params);
  }

  public post<T>(url: string, params?: HttpParams): Promise<T> {
    return this.request('post', url, params);
  }

  public put<T>(url: string, params?: HttpParams): Promise<T> {
    return this.request('put', url, params);
  }

  public patch<T>(url: string, params?: HttpParams): Promise<T> {
    return this.request('patch', url, params);
  }

  public delete<T>(url: string, params?: HttpParams): Promise<T> {
    return this.request('delete', url, params);
  }

  private async request<T>(method: AxiosRequestMethod, url: string, params?: HttpParams): Promise<T> {
    try {
      const response = await axios.request({
        url,
        method,
        params: params?.query,
        data: params?.body,
        headers: { 'Content-Type': 'application/json', ...params?.headers },
      });
      this.logMessage(method, response.status, url, response.data, params);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logError(method, error.status, url, error?.response?.data, params);
      }
      throw error;
    }
  }

  private logMessage(
    method: AxiosRequestMethod,
    status: number | string,
    url: string,
    response: any,
    params?: HttpParams,
  ) {
    const prefix = `${method.toUpperCase()}: ${url}`;
    const paramsStr = `params: ${JSON.stringify(params)}`;
    const responseStr = `response: ${JSON.stringify(response)}`;
    const statusStr = `status: ${status}`;
    const message = `${prefix}, ${statusStr}, ${paramsStr}, ${responseStr}`;
    this.logger.info(`AxiosHttpServiceImpl - ${message}`);
  }

  private logError(
    method: AxiosRequestMethod,
    status: number | string,
    url: string,
    response: any,
    params?: HttpParams,
  ) {
    const prefix = `${method.toUpperCase()}: ${url}`;
    const paramsStr = `params: ${JSON.stringify(params)}`;
    const responseStr = `response: ${JSON.stringify(response)}`;
    const statusStr = `status: ${status}`;
    const message = `${prefix}, ${statusStr}, ${paramsStr}, ${responseStr}`;
    this.logger.error(`AxiosHttpServiceImpl - ${message}`);
  }
}
