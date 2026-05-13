import localforage from "localforage";

export const sessionStore = localforage.createInstance({
  name: "msc-mobile-db",
  storeName: "session",
});

export const metadataStore = localforage.createInstance({
  name: "msc-mobile-db",
  storeName: "metadata",
});

export const contactsStore = localforage.createInstance({
  name: "msc-mobile-db",
  storeName: "contacts",
});

export const productsStore = localforage.createInstance({
  name: "msc-mobile-db",
  storeName: "products",
});

export const billAccountsStore = localforage.createInstance({
  name: "msc-mobile-db",
  storeName: "bill_accounts",
});

export const cartsStore = localforage.createInstance({
  name: "msc-mobile-db",
  storeName: "carts",
});

export const salesStore = localforage.createInstance({
  name: "msc-mobile-db",
  storeName: "sales",
});

export const expensesStore = localforage.createInstance({
  name: "msc-mobile-db",
  storeName: "expenses",
});
