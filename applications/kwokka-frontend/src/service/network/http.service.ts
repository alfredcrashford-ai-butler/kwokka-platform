import { inject, injectable } from 'inversify';
import { ConfigService } from '../config/config.service';
import type { InterceptorParams, RequestInterceptor, ResponseInterceptor } from './interceptor';

export interface NetworkRequestOptions {
  headers?: any;
  params?: any;
}

export interface NetworkResponse<T> {
  data: T;
  meta: {
    timestamp: number;
    offset?: number;
    limit?: number;
    count?: number;
  };
}

export class NetworkError extends Error {
  public constructor(
    public readonly status: number,
    public readonly data: any,
    public readonly message: string = 'Unexpected error occured. Our developers have already started fixing it!',
    public readonly code: string = 'UNEXPECTED_ERROR',
  ) {
    super(message);
  }

  public log() {
    const data = JSON.stringify(this.data, null, 2);
    console.error(`[${this.name}]: ${this.status} ${this.message}\n\nData: ${data}\n\n${this.stack}`);
  }
}

@injectable()
export class HttpService {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private baseUrl: string;

  public constructor(@inject(ConfigService) private configService: ConfigService) {
    this.baseUrl = this.configService.frontendConfig.apiGateway;
  }

  public get<T = any>(url: string, headers?: Record<string, string>): Promise<NetworkResponse<T>> {
    return this.fetchAndParseBody(url, { headers, method: 'GET' });
  }

  public post<T = any, K = any>(url: string, body?: K, headers?: Record<string, string>): Promise<NetworkResponse<T>> {
    return this.fetchAndParseBody(url, { headers, method: 'POST' }, body);
  }

  public put<T = any, K = any>(url: string, body?: K, headers?: Record<string, string>): Promise<NetworkResponse<T>> {
    return this.fetchAndParseBody(url, { headers, method: 'PUT' }, body);
  }

  public patch<T = any, K = any>(url: string, body?: K, headers?: Record<string, string>): Promise<NetworkResponse<T>> {
    return this.fetchAndParseBody(url, { headers, method: 'PATCH' }, body);
  }

  public delete<T = any>(url: string, headers?: Record<string, string>): Promise<NetworkResponse<T>> {
    return this.fetchAndParseBody(url, { headers, method: 'DELETE' });
  }

  public setRequestInterceptors(interceptors: RequestInterceptor[]): void {
    this.requestInterceptors = interceptors;
  }

  public setResponseInterceptors(interceptors: ResponseInterceptor[]): void {
    this.responseInterceptors = interceptors;
  }

  private async fetchAndParseBody<T = any, K = any>(path: string, options: RequestInit, body?: K): Promise<T> {
    const res = await this.fetch(path, options, body);
    const responseBody = await this.getResponseBody(res);
    if (res.status >= 400) {
      throw new NetworkError(res.status, responseBody, responseBody?.error?.message, responseBody?.error?.code);
    }

    return responseBody;
  }

  public async fetch<T = any>(path: string, options: RequestInit, body?: T): Promise<Response> {
    const url = this.cookUrl(this.baseUrl, path);
    let params: InterceptorParams = { url, path, body, method: options.method, headers: options?.headers };
    params = await this.processRequestInterceptors(params);

    const requestBody = params.body && JSON.stringify(params.body);
    let res = await fetch(params.url, { headers: params.headers, method: params.method, body: requestBody });

    res = await this.processResponseInterceptors(params, res);

    return res;
  }

  private getResponseBody(res: Response): Promise<any> {
    const contentType = res.headers.get('Content-Type');
    if (contentType.includes('application/json')) {
      return res.json();
    }

    return res.text();
  }

  private async processRequestInterceptors(params: InterceptorParams): Promise<InterceptorParams> {
    for (let i = 0; i < this.requestInterceptors.length; i++) {
      params = await this.requestInterceptors[i].perform(params);
    }
    return params;
  }

  private async processResponseInterceptors(params: InterceptorParams, res: Response): Promise<Response> {
    for (let i = 0; i < this.responseInterceptors.length; i++) {
      res = await this.responseInterceptors[i].perform(params, res);
    }
    return res;
  }

  private cookUrl(baseUrl: string, path: string): string {
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    baseUrl = baseUrl.replace(/\/*$/g, '');
    return `${baseUrl}${path}`;
  }
}
