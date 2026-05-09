import type { Cart, CartItem } from "domain/entities/Cart";
import { cartsStore } from "infrastructure/storage/localDb";

const cartKey = (customerId: string) => `cart:${customerId}`;

export class CartLocalDataSource {
  async getCart(customerId: string): Promise<Cart | null> {
    return cartsStore.getItem<Cart>(cartKey(customerId));
  }

  async saveCart(cart: Cart): Promise<void> {
    await cartsStore.setItem(cartKey(cart.customerId), cart);
  }

  async upsertItem(customerId: string, item: CartItem): Promise<Cart> {
    const existing = await this.getCart(customerId);
    const now = new Date().toISOString();

    if (!existing) {
      const cart: Cart = {
        customerId,
        items: [item],
        createdAt: now,
        updatedAt: now,
      };
      await this.saveCart(cart);
      return cart;
    }

    const idx = existing.items.findIndex((i) => i.productId === item.productId);
    if (idx >= 0) {
      existing.items[idx] = item;
    } else {
      existing.items.push(item);
    }
    existing.updatedAt = now;
    await this.saveCart(existing);
    return existing;
  }

  async removeItem(customerId: string, productId: string): Promise<Cart | null> {
    const cart = await this.getCart(customerId);
    if (!cart) return null;

    cart.items = cart.items.filter((i) => i.productId !== productId);
    cart.updatedAt = new Date().toISOString();
    await this.saveCart(cart);
    return cart;
  }

  async clearCart(customerId: string): Promise<void> {
    await cartsStore.removeItem(cartKey(customerId));
  }
}
