import type { Contact } from "domain/entities/Contact";
import { contactsStore } from "infrastructure/storage/localDb";

const CUSTOMERS_KEY = "customers";

export class ContactsLocalDataSource {
  async saveCustomers(customers: Contact[]): Promise<void> {
    await contactsStore.setItem(CUSTOMERS_KEY, customers);
  }

  async getCustomers(): Promise<Contact[]> {
    const customers = await contactsStore.getItem<Contact[]>(CUSTOMERS_KEY);
    return customers || [];
  }

  async clearCustomers(): Promise<void> {
    await contactsStore.removeItem(CUSTOMERS_KEY);
  }
}
