import { ContactsLocalDataSource } from "data/datasources/local/ContactsLocalDataSource";
import { SessionLocalDataSource } from "data/datasources/local/SessionLocalDataSource";
import { SyncLocalDataSource } from "data/datasources/local/SyncLocalDataSource";
import { AuthRemoteDataSource } from "data/datasources/remote/AuthRemoteDataSource";
import { ContactsRemoteDataSource } from "data/datasources/remote/ContactsRemoteDataSource";
import { AuthRepositoryImpl } from "data/repositories/AuthRepositoryImpl";
import { ContactRepositoryImpl } from "data/repositories/ContactRepositoryImpl";
import { SyncRepositoryImpl } from "data/repositories/SyncRepositoryImpl";
import { GetPersistedSessionUseCase } from "domain/usecases/GetPersistedSessionUseCase";
import { GetLocalCustomersUseCase } from "domain/usecases/GetLocalCustomersUseCase";
import { GetSyncStatusUseCase } from "domain/usecases/GetSyncStatusUseCase";
import { LoginUseCase } from "domain/usecases/LoginUseCase";
import { LogoutUseCase } from "domain/usecases/LogoutUseCase";
import { SyncInitialDataUseCase } from "domain/usecases/SyncInitialDataUseCase";
import { ApiClient } from "infrastructure/http/ApiClient";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const apiClient = new ApiClient(apiBaseUrl);

const authRemoteDataSource = new AuthRemoteDataSource(apiClient);
const contactsRemoteDataSource = new ContactsRemoteDataSource(apiClient);

const sessionLocalDataSource = new SessionLocalDataSource();
const contactsLocalDataSource = new ContactsLocalDataSource();
const syncLocalDataSource = new SyncLocalDataSource();

const authRepository = new AuthRepositoryImpl(
  authRemoteDataSource,
  sessionLocalDataSource,
);
const contactRepository = new ContactRepositoryImpl(contactsLocalDataSource);
const syncRepository = new SyncRepositoryImpl(
  contactsRemoteDataSource,
  contactsLocalDataSource,
  syncLocalDataSource,
);

export const container = {
  loginUseCase: new LoginUseCase(authRepository),
  getPersistedSessionUseCase: new GetPersistedSessionUseCase(authRepository),
  syncInitialDataUseCase: new SyncInitialDataUseCase(syncRepository),
  getLocalCustomersUseCase: new GetLocalCustomersUseCase(contactRepository),
  getSyncStatusUseCase: new GetSyncStatusUseCase(syncRepository),
  logoutUseCase: new LogoutUseCase(authRepository, syncRepository),
};
