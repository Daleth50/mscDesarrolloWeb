import { ApiRequestInterceptor, type ApiInterceptorConfig } from "./ApiRequestInterceptor";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export class ApiClient {
  private readonly interceptor: ApiRequestInterceptor;

  constructor(
    private readonly baseUrl: string,
    interceptorConfig: ApiInterceptorConfig,
  ) {
    this.interceptor = new ApiRequestInterceptor(interceptorConfig);
  }

  async get<T>(path: string, token?: string): Promise<T> {
    return this.request<T>(path, {
      method: "GET",
      token,
    });
  }

  async post<T>(path: string, body: unknown, token?: string): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body,
      token,
    });
  }

  async delete<T>(path: string, token?: string): Promise<T> {
    return this.request<T>(path, {
      method: "DELETE",
      token,
    });
  }

  private async request<T>(
    path: string,
    options: { method: "GET" | "POST" | "DELETE"; body?: unknown; token?: string },
  ): Promise<T> {
    // Intercept request - attach headers with token if needed
    const interceptedRequest = await this.interceptor.interceptRequest(path, options);

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: interceptedRequest.method,
      headers: interceptedRequest.headers,
      body: interceptedRequest.body,
    });

    // Intercept response - handle 401 and extract payload
    return this.interceptor.interceptResponse<T>(response);
  }
}
