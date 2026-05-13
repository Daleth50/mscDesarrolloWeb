export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export interface ApiInterceptorConfig {
  /** Callback to retrieve current session token */
  getToken: () => Promise<string | null>;
  /** Callback invoked when 401 response is received */
  onUnauthorized: () => void;
}

export class ApiRequestInterceptor {
  constructor(private readonly config: ApiInterceptorConfig) {}

  /**
   * Interceptor for request interception - attaches bearer token if endpoint is not login
   */
  async interceptRequest(
    path: string,
    options: { method: "GET" | "POST" | "DELETE"; body?: unknown; token?: string },
  ): Promise<{ method: "GET" | "POST" | "DELETE"; headers: Headers; body?: string }> {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    // Only inject token for non-login endpoints
    if (!path.includes("/auth/login")) {
      const token = await this.config.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    };
  }

  /**
   * Interceptor for response interception - handles 401 and extracts payload
   */
  async interceptResponse<T>(response: Response): Promise<T> {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    // Handle 401 Unauthorized
    if (response.status === 401) {
      this.config.onUnauthorized();
      throw new ApiError(payload?.error || "Unauthorized", 401);
    }

    // Handle other errors
    if (!response.ok) {
      throw new ApiError(payload?.error || "Request failed", response.status);
    }

    return payload as T;
  }
}
