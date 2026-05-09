import { CartLocalDataSource } from "data/datasources/local/CartLocalDataSource";
import type { Cart, CartItem } from "domain/entities/Cart";
import type { CartRepository } from "domain/repositories/CartRepository";

export class CartRepositoryImpl implements CartRepository {
  constructor(private readonly cartLocalDataSource: CartLocalDataSource) {}

  getCart(customerId: string): Promise<Cart | null> {
    return this.cartLocalDataSource.getCart(customerId);
  }

  upsertItem(customerId: string, item: CartItem): Promise<Cart> {
    return this.cartLocalDataSource.upsertItem(customerId, item);
  }

  removeItem(customerId: string, productId: string): Promise<Cart | null> {
    return this.cartLocalDataSource.removeItem(customerId, productId);
  }

  clearCart(customerId: string): Promise<void> {
    return this.cartLocalDataSource.clearCart(customerId);
  }
}
