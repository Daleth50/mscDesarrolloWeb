import { ContactsLocalDataSource } from "data/datasources/local/ContactsLocalDataSource";
import type { Contact } from "domain/entities/Contact";
import type { ContactRepository } from "domain/repositories/ContactRepository";

export class ContactRepositoryImpl implements ContactRepository {
  constructor(private readonly contactsLocalDataSource: ContactsLocalDataSource) {}

  async getLocalCustomers(): Promise<Contact[]> {
    const contacts = await this.contactsLocalDataSource.getCustomers();
    return contacts.filter((contact) => contact.kind === "customer");
  }

  async saveLocalCustomers(contacts: Contact[]): Promise<void> {
    await this.contactsLocalDataSource.saveCustomers(contacts);
  }
}
