import type { ContactRepository } from "domain/repositories/ContactRepository";
import type { Contact } from "domain/entities/Contact";

export class AddLocalCustomerUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(input: Omit<Contact, "id">) {
    const existing = await this.contactRepository.getLocalCustomers();
    const id = `local-${Date.now()}`;
    const newContact: Contact = {
      id,
      ...input,
      kind: "customer",
      pendingSync: true,
    } as Contact;

    await this.contactRepository.saveLocalCustomers([...existing, newContact]);
    return newContact;
  }
}
