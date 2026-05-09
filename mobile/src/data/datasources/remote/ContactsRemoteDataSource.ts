import type { Contact } from "domain/entities/Contact";
import { ApiClient } from "infrastructure/http/ApiClient";

export class ContactsRemoteDataSource {
  constructor(private readonly apiClient: ApiClient) {}

  async getCustomers(token: string): Promise<Contact[]> {
    return this.apiClient.get<Contact[]>("/api/contacts?kind=customer", token);
  }
}
