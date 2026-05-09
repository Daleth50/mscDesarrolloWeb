import type { Category } from "domain/entities/Category";
import type { Product } from "domain/entities/Product";
import { productsStore } from "infrastructure/storage/localDb";

const PRODUCTS_KEY = "products";
const CATEGORIES_KEY = "categories";

export class ProductsLocalDataSource {
  async saveProducts(products: Product[]): Promise<void> {
    await productsStore.setItem(PRODUCTS_KEY, products);
  }

  async getProducts(): Promise<Product[]> {
    return (await productsStore.getItem<Product[]>(PRODUCTS_KEY)) ?? [];
  }

  async saveCategories(categories: Category[]): Promise<void> {
    await productsStore.setItem(CATEGORIES_KEY, categories);
  }

  async getCategories(): Promise<Category[]> {
    return (await productsStore.getItem<Category[]>(CATEGORIES_KEY)) ?? [];
  }

  async clear(): Promise<void> {
    await productsStore.removeItem(PRODUCTS_KEY);
    await productsStore.removeItem(CATEGORIES_KEY);
  }
}
