import type { CartRepository } from "domain/repositories/CartRepository";

export class ClearCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(customerId: string) {
    return this.cartRepository.clearCart(customerId);
  }
}
