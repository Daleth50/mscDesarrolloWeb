import type { CartRepository } from "domain/repositories/CartRepository";

export class GetCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(customerId: string) {
    return this.cartRepository.getCart(customerId);
  }
}
