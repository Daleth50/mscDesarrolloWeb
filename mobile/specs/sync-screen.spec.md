# Sync Screen Specification

## Goal
Download required remote data after login and persist it locally so the app works offline-first.

## UI Layout
- Centered cloud icon (☁, circular background)
- Title: "Sincronizar"
- Subtitle describing current state
- Progress bars per entity, each showing label, percentage and item count
- Error alert when sync fails
- "Reintentar sincronización" button (only on error)
- "Cerrar sesión" outline button (always visible)

## Entities Synced (in order)
1. **Clientes** — `GET /api/contacts?kind=customer`
2. **Categorías** — categories endpoint
3. **Productos** — products + inventory endpoint
4. **Cuentas de cobro** — bill accounts endpoint

## Functional Requirements
- Screen appears right after login, before entering tabs.
- Sync starts automatically on mount.
- Each entity shows its own progress bar that fills as the step completes.
- On success, mark app as synchronized and navigate to `/tabs/customers`.
- On failure, show error message and allow retry.
- User can logout at any time from this screen.

## Non-Functional Requirements
- Sync process must be orchestrated by `SyncInitialDataUseCase`.
- Data source details (HTTP, local DB) must stay in infrastructure/data layers.
- Sync operation must be idempotent (repeat does not create inconsistent state).
