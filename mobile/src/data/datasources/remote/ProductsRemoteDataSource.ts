import type { Category } from "domain/entities/Category";
import type { Product } from "domain/entities/Product";
import { ApiClient } from "infrastructure/http/ApiClient";

export class ProductsRemoteDataSource {
  constructor(private readonly apiClient: ApiClient) {}

  async getPosProducts(token: string): Promise<Product[]> {
    return this.apiClient.get<Product[]>("/api/pos/products", token);
  }

  async getCategories(token: string): Promise<Category[]> {
    return this.apiClient.get<Category[]>("/api/categories", token);
  }
}
