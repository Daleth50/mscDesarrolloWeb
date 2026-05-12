# Profile Tab Specification

## Goal
Provide a user profile management interface with options for re-initializing sync and logging out of the application.

## UI Layout
- Header: "Perfil"
- User info section: Display current user email and role
- Action buttons (full width, stacked):
  1. "Sincronización inicial" button (secondary/outline style)
  2. "Cerrar sesión" button (destructive/danger style)
- Spacing and alignment follow app design system

## Functional Requirements
- **Sincronización inicial**: 
  - On tap, clear local data cache (sales, customers, products, inventory, etc.)
  - Navigate to Sync Screen to re-download all initial data
  - Preserve user session (token remains valid)
  
- **Cerrar sesión**:
  - On tap, clear local session token and user profile
  - Clear all local data cache
  - Clear any pending sync data
  - Navigate to Login Screen
  - Show confirmation dialog before logout to prevent accidental action

- Display current authenticated user's email and role (if available) in a read-only section
- Handle offline state gracefully (buttons remain functional)

## Validation Rules
- Buttons are always enabled (no loading states required for logout)
- For "Sincronización inicial", show loading indicator during cache clear
- For "Cerrar sesión", show confirmation dialog with "Cancelar" and "Cerrar sesión" options

## Non-Functional Requirements
- Follow SOLID by delegating logout and cache clear logic to use cases and repositories
- Integrate with `AppStateContext` to update app state on logout
- Use repository methods to clear local storage
- Prevent navigation race conditions by handling state updates synchronously
- Support future profile editing features without changing current structure
