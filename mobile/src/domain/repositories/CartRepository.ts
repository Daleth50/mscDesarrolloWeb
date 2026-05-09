import type { Cart, CartItem } from "domain/entities/Cart";

export interface CartRepository {
  getCart(customerId: string): Promise<Cart | null>;
  upsertItem(customerId: string, item: CartItem): Promise<Cart>;
  removeItem(customerId: string, productId: string): Promise<Cart | null>;
  clearCart(customerId: string): Promise<void>;
}
