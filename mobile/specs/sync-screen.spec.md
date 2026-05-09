# Sync Screen Specification

## Goal
Download required remote data after login and persist it locally so the app works offline-first.

## Functional Requirements
- Screen must appear right after login, before entering tabs.
- The screen must show current sync state:
  - Idle
  - In progress
  - Success
  - Error
- The screen must fetch the initial datasets from backend API.
- At minimum it must download customers from `GET /api/contacts?kind=customer`.
- The app must store synchronized entities in local database.
- On success, mark app as synchronized and navigate to tabs.
- If synchronization fails, user can retry.
- User can logout from this screen.

## Non-Functional Requirements
- Sync process must be orchestrated by an application use case.
- Data source details (HTTP, local DB) must stay in infrastructure/data layers.
- Sync operation should be idempotent (repeat does not create inconsistent state).
