import type { Contact } from "../entities/Contact";

export interface ContactRepository {
  getLocalCustomers(): Promise<Contact[]>;
  getPendingLocalCustomers(): Promise<Contact[]>;
  saveLocalCustomers(contacts: Contact[]): Promise<void>;
}
