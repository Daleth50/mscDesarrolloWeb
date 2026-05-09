import type { CartRepository } from "domain/repositories/CartRepository";

export class RemoveFromCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(customerId: string, productId: string) {
    return this.cartRepository.removeItem(customerId, productId);
  }
}
