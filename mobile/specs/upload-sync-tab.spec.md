# Upload Sync Tab Specification

## Goal
Allow the salesperson to upload locally captured sales to the server when connectivity is available.

## UI Layout
- Page header with title "Sincronizar"
- Centered cloud upload icon
- Title: "Subir ventas"
- Subtitle describing the purpose
- Progress bar for "Ventas pendientes" showing count and upload percentage
- Row showing last sync timestamp
- Success message (green) or error alert on completion
- "Sincronizar" primary button

## Functional Requirements
- Route: `/tabs/sync` (tab 4 of 5 in the bottom tab bar)
- On mount, load pending sale count from `SalesLocalDataSource.getPendingSales()`.
- Tapping "Sincronizar" uploads all `pending_sync` sales to the server.
- Progress bar updates as each sale is processed.
- On success, pending count resets to 0 and a success message is displayed.
- On error, an error alert is displayed.
- Button is disabled while upload is in progress.

## Distinction from Initial Sync
This screen handles **uploading** local data (sales) to the server. The initial sync screen (`/sync`) handles **downloading** reference data (customers, products, etc.) after login. These are separate flows with separate routes and components.

## Non-Functional Requirements
- Requires active session; redirects to `/login` if session is absent.
- Upload logic should eventually be extracted to a dedicated use case.
