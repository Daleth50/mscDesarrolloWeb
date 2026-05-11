import { BillAccountsLocalDataSource } from "data/datasources/local/BillAccountsLocalDataSource";
import { CartLocalDataSource } from "data/datasources/local/CartLocalDataSource";
import { ContactsLocalDataSource } from "data/datasources/local/ContactsLocalDataSource";
import { ProductsLocalDataSource } from "data/datasources/local/ProductsLocalDataSource";
import { SalesLocalDataSource } from "data/datasources/local/SalesLocalDataSource";
import { SessionLocalDataSource } from "data/datasources/local/SessionLocalDataSource";
import { SyncLocalDataSource } from "data/datasources/local/SyncLocalDataSource";
import { AuthRemoteDataSource } from "data/datasources/remote/AuthRemoteDataSource";
import { BillAccountsRemoteDataSource } from "data/datasources/remote/BillAccountsRemoteDataSource";
import { ContactsRemoteDataSource } from "data/datasources/remote/ContactsRemoteDataSource";
import { ProductsRemoteDataSource } from "data/datasources/remote/ProductsRemoteDataSource";
import { AuthRepositoryImpl } from "data/repositories/AuthRepositoryImpl";
import { CartRepositoryImpl } from "data/repositories/CartRepositoryImpl";
import { ContactRepositoryImpl } from "data/repositories/ContactRepositoryImpl";
import { SyncRepositoryImpl } from "data/repositories/SyncRepositoryImpl";
import { AddToCartUseCase } from "domain/usecases/AddToCartUseCase";
import { ClearCartUseCase } from "domain/usecases/ClearCartUseCase";
import { CompleteSaleUseCase } from "domain/usecases/CompleteSaleUseCase";
import { GetCartUseCase } from "domain/usecases/GetCartUseCase";
import { GetLocalBillAccountsUseCase } from "domain/usecases/GetLocalBillAccountsUseCase";
import { GetLocalCustomersUseCase } from "domain/usecases/GetLocalCustomersUseCase";
import { AddLocalCustomerUseCase } from "domain/usecases/AddLocalCustomerUseCase";
import { GetLocalProductsUseCase } from "domain/usecases/GetLocalProductsUseCase";
import { GetPersistedSessionUseCase } from "domain/usecases/GetPersistedSessionUseCase";
import { GetSyncStatusUseCase } from "domain/usecases/GetSyncStatusUseCase";
import { LoginUseCase } from "domain/usecases/LoginUseCase";
import { LogoutUseCase } from "domain/usecases/LogoutUseCase";
import { RemoveFromCartUseCase } from "domain/usecases/RemoveFromCartUseCase";
import { SyncInitialDataUseCase } from "domain/usecases/SyncInitialDataUseCase";
import { Capacitor } from "@capacitor/core";
import { ApiClient } from "infrastructure/http/ApiClient";

function resolveApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android") {
    // Android emulator routes host machine via 10.0.2.2
    return envUrl.replace(/^http:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?/, (_: string, port: string) => `http://10.0.2.2${port ?? ""}`);
  }
  return envUrl;
}

const apiBaseUrl = resolveApiBaseUrl();

const apiClient = new ApiClient(apiBaseUrl);

const authRemoteDataSource = new AuthRemoteDataSource(apiClient);
const contactsRemoteDataSource = new ContactsRemoteDataSource(apiClient);
const productsRemoteDataSource = new ProductsRemoteDataSource(apiClient);
const billAccountsRemoteDataSource = new BillAccountsRemoteDataSource(apiClient);

const sessionLocalDataSource = new SessionLocalDataSource();
const contactsLocalDataSource = new ContactsLocalDataSource();
const productsLocalDataSource = new ProductsLocalDataSource();
const billAccountsLocalDataSource = new BillAccountsLocalDataSource();
const cartLocalDataSource = new CartLocalDataSource();
const salesLocalDataSource = new SalesLocalDataSource();
const syncLocalDataSource = new SyncLocalDataSource();

const authRepository = new AuthRepositoryImpl(authRemoteDataSource, sessionLocalDataSource);
const contactRepository = new ContactRepositoryImpl(contactsLocalDataSource);
const cartRepository = new CartRepositoryImpl(cartLocalDataSource);
const syncRepository = new SyncRepositoryImpl(
  contactsRemoteDataSource,
  contactsLocalDataSource,
  productsRemoteDataSource,
  productsLocalDataSource,
  billAccountsRemoteDataSource,
  billAccountsLocalDataSource,
  syncLocalDataSource,
);

export const container = {
  salesLocalDataSource,
  loginUseCase: new LoginUseCase(authRepository),
  getPersistedSessionUseCase: new GetPersistedSessionUseCase(authRepository),
  syncInitialDataUseCase: new SyncInitialDataUseCase(syncRepository),
  getLocalCustomersUseCase: new GetLocalCustomersUseCase(contactRepository),
  addLocalCustomerUseCase: new AddLocalCustomerUseCase(contactRepository),
  getLocalProductsUseCase: new GetLocalProductsUseCase(productsLocalDataSource),
  getLocalBillAccountsUseCase: new GetLocalBillAccountsUseCase(billAccountsLocalDataSource),
  getSyncStatusUseCase: new GetSyncStatusUseCase(syncRepository),
  logoutUseCase: new LogoutUseCase(authRepository, syncRepository),
  getCartUseCase: new GetCartUseCase(cartRepository),
  addToCartUseCase: new AddToCartUseCase(cartRepository),
  removeFromCartUseCase: new RemoveFromCartUseCase(cartRepository),
  clearCartUseCase: new ClearCartUseCase(cartRepository),
  completeSaleUseCase: new CompleteSaleUseCase(salesLocalDataSource),
};
