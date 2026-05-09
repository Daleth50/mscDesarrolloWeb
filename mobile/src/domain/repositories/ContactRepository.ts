import type { Contact } from "../entities/Contact";

export interface ContactRepository {
  getLocalCustomers(): Promise<Contact[]>;
  saveLocalCustomers(contacts: Contact[]): Promise<void>;
}
