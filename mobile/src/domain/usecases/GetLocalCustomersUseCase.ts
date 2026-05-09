import type { ContactRepository } from "domain/repositories/ContactRepository";

export class GetLocalCustomersUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute() {
    return this.contactRepository.getLocalCustomers();
  }
}
