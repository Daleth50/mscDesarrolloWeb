# Tabs Shell Specification

## Goal
Provide a post-sync tabbed navigation shell for the main app workflows.

## Tab Bar
Five tabs in this order:

| Tab | Icon | Route | Component |
|-----|------|-------|-----------|
| Vender | storefrontOutline | `/tabs/customers` | `CustomersTabPage` |
| Cambios | swapHorizontalOutline | `/tabs/returns` | `PlaceholderPage` |
| Gastos | cashOutline | `/tabs/expenses` | `PlaceholderPage` |
| Sincronizar | cloudUploadOutline | `/tabs/sync` | `UploadSyncTabPage` |
| Perfil | personOutline | `/tabs/profile` | `PlaceholderPage` |

## Functional Requirements
- Tabs are accessible only when the user has an active session and a completed initial sync.
- Default tab on entry is **Vender** (`/tabs/customers`).
- **Sincronizar tab** handles uploading local `pending_sync` sales to the server — it is distinct from the initial data download sync that happens at login.
- Logout must clear local session and return to Login Screen; this action lives in the Perfil tab (placeholder until implemented).

## Non-Functional Requirements
- Route guards must enforce session and sync prerequisites.
- Navigation decisions use application state from `AppStateContext`, not ad-hoc checks.
- Placeholder tabs (`Cambios`, `Gastos`, `Perfil`) display a "Próximamente" message until implemented.
