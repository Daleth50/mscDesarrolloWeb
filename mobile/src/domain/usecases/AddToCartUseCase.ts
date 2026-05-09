import type { CartRepository } from "domain/repositories/CartRepository";

export class AddToCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(customerId: string, productId: string, productName: string, price: number, quantity: number) {
    if (quantity <= 0) throw new Error("Quantity must be greater than zero");
    return this.cartRepository.upsertItem(customerId, { productId, productName, price, quantity });
  }
}
