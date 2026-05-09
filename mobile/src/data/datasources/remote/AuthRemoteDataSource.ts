import type { Session } from "domain/entities/Session";
import { ApiClient } from "infrastructure/http/ApiClient";

interface LoginResponse {
  token: string;
  user: Session["user"];
}

export class AuthRemoteDataSource {
  constructor(private readonly apiClient: ApiClient) {}

  async login(identifier: string, password: string): Promise<Session> {
    const response = await this.apiClient.post<LoginResponse>("/api/auth/login", {
      identifier,
      password,
    });

    return {
      token: response.token,
      user: response.user,
    };
  }
}
