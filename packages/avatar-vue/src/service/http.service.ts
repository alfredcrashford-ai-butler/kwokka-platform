import { KwokkaAvatarError } from '@/errors';

export class HttpService {
  public get<T = any>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.fetch(url, { headers, method: 'GET' });
  }

  public post<T = any, K = any>(url: string, body?: K, headers?: Record<string, string>): Promise<T> {
    return this.fetch(url, { headers, method: 'POST' }, body);
  }

  public put<T = any, K = any>(url: string, body?: K, headers?: Record<string, string>): Promise<T> {
    return this.fetch(url, { headers, method: 'PUT' }, body);
  }

  public patch<T = any, K = any>(url: string, body?: K, headers?: Record<string, string>): Promise<T> {
    return this.fetch(url, { headers, method: 'PATCH' }, body);
  }

  public delete<T = any>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.fetch(url, { headers, method: 'DELETE' });
  }

  private fetch<T = any, K = any>(url: string, options: RequestInit, body?: K): Promise<T> {
    const headers = { 'Content-Type': 'application/json;charset=UTF-8', ...options?.headers };
    return fetch(url, { headers, method: options.method, body: body && JSON.stringify(body) }).then(
      async (res: Response) => {
        const responseBody = await this.getResponseBody(res);
        if (res.status >= 400) {
          throw new KwokkaAvatarError(responseBody?.error?.message, responseBody?.error?.code, {
            status: res.status,
            body: responseBody,
          });
        }

        return responseBody;
      },
    );
  }

  private getResponseBody(res: Response): Promise<any> {
    const contentType = res.headers.get('Content-Type');
    if (contentType.includes('application/json')) {
      return res.json();
    }

    return res.text();
  }
}
