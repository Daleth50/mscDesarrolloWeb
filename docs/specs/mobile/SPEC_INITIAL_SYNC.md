# Spec: Initial Data Sync

## Overview

On first login the mobile app has no local data. The Initial Sync screen downloads all master data required for offline POS operation and stores it in IndexedDB via localforage.

## Trigger

Shown automatically after login when `isInitialSyncCompleted === false`.

## Data downloaded (in order)

| Step | Endpoint | Local store |
|------|----------|-------------|
| 1 | `GET /api/contacts?kind=customer` | `contacts` → key `customers` |
| 2 | `GET /api/categories` | `products` → key `categories` |
| 3 | `GET /api/pos/products` | `products` → key `products` |
| 4 | `GET /api/pos/bill-accounts` | `bill_accounts` → key `bill_accounts` |

## UI behaviour

- Progress bar advances 25 % per completed step.
- Step label updates in real time ("Downloading customers…", etc.).
- On success: navigates to `/tabs/customers` and shows a summary (`N customers · N products · N categories · N accounts`).
- On failure: shows error message and a **Retry** button that re-runs the full sync.
- A **Logout** button is always visible.

## Completion flag

`metadata` store keys:
- `initial_sync_completed` → `true`
- `last_sync_at` → ISO timestamp

## Re-sync / reset

`SyncRepository.resetSyncState()` clears customers, products, bill-accounts, and the metadata flags. Called on logout.

## Domain layer

```
SyncInitialDataUseCase.execute(token, onStep?)
  └─ SyncRepositoryImpl.syncInitialData(token, onStep?)
       ├─ ContactsRemoteDataSource.getCustomers()
       ├─ ProductsRemoteDataSource.getCategories()
       ├─ ProductsRemoteDataSource.getPosProducts()
       └─ BillAccountsRemoteDataSource.getBillAccounts()
```
