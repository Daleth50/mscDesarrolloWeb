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
