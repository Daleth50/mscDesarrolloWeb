# Sync Screens Specification

## Overview
The mobile app has two sync flows:
1. **Initial Sync** — Downloads master data after login (one-time)
2. **Upload Sync** — Periodically uploads local changes to backend (ongoing)

---

## Initial Sync Screen

### Goal
Download required remote data after login and persist it locally so the app works offline-first.

### Route
`/sync` — shown automatically after login when `isInitialSyncCompleted === false`

### UI Layout
- Centered cloud icon (☁, circular background)
- Title: "Sincronizar"
- Subtitle: "Descargando datos requeridos..."
- Progress bars per entity, each showing label, percentage and item count
- Error alert when sync fails
- "Reintentar sincronización" button (only on error)
- "Cerrar sesión" outline button (always visible)

### Entities Downloaded (in order)
1. **Clientes** — `GET /api/contacts?kind=customer`
2. **Categorías** — `GET /api/categories`
3. **Productos** — `GET /api/pos/products` + inventory
4. **Cuentas de cobro** — `GET /api/pos/bill-accounts`

### Functional Requirements
- Screen appears right after login, before entering tabs
- Sync starts automatically on mount
- Each entity shows its own progress bar (25% per step)
- On success: mark app as synchronized, navigate to `/tabs/customers`, show summary
- On failure: show error message and allow retry
- User can logout at any time from this screen

### Non-Functional Requirements
- Sync process orchestrated by `SyncInitialDataUseCase`
- Data persisted in localforage stores
- Operation must be idempotent (repeat safe)
- Completion flag: `metadata` store key `initial_sync_completed = true`

---

## Upload Sync Tab

### Goal
Allow user to manually sync local changes (customers, sales, expenses) to backend. Changes stay `pending_sync` until successfully uploaded.

### Route
`/tabs/sync` — accessible from tab bar after initial sync is complete

### UI Layout
- Centered cloud icon (☁, circular background)
- Title: "Sincronizar"
- Subtitle: "Envía los cambios capturados offline al servidor"
- Progress bars for each entity type, showing count of pending items
- Error alert if sync fails
- "Sincronizar" button (disabled while running)
- Summary message on success (e.g., "2 clientes, 5 ventas, 3 gastos sincronizados")

### Entities Uploaded (in parallel)

#### 1. Clientes Pendientes
- **Source**: local storage key `contacts`
- **Filter**: items with `pendingSync === true`
- **Endpoint**: `POST /api/contacts` (batch or individual)
- **On Success**: mark customer as `pendingSync = false` locally

#### 2. Ventas Pendientes
- **Source**: local storage key `sales`
- **Filter**: items with `status === "pending_sync"`
- **Endpoint**: `POST /api/orders` (batch)
- **On Success**: mark sale as `status = "synced"` locally

#### 3. Gastos Pendientes
- **Source**: local storage key `expenses`
- **Filter**: items with `status === "pending_sync"`
- **Endpoint**: `POST /api/expenses` (one by one)
- **On Success**: mark expense as `status = "synced"` locally

### Functional Requirements
- User taps "Sincronizar" button to start upload
- All pending items sync in parallel (or sequentially per entity type)
- Progress shown for each entity type
- On success: show success message with counts, clear pending counts
- On partial failure: show which items failed, allow user to retry sync
- On complete failure: show error message, allow retry
- User can navigate away during sync (sync continues in background)

### Non-Functional Requirements
- Sync process orchestrated by:
  - `SyncPendingCustomersUseCase`
  - `SyncPendingSalesUseCase`
  - `SyncPendingExpensesUseCase`
- Each entity type is independent (one failure doesn't block others)
- Token required for all requests (attach to each call)
- Idempotent: syncing same items twice is safe
- Items not retried on failure (user must manually retry from UI)
