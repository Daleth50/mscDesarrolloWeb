# Login Screen Specification

## Goal
Allow a user to authenticate against the backend API and persist session credentials for offline usage.

## Functional Requirements
- The screen must be the app entry point when there is no active session.
- The screen must include:
  - Identifier field (email or username)
  - Password field
  - Sign in button
- On submit, the app must call `POST /api/auth/login`.
- On success, the app must persist token and user profile in local storage.
- On success, the app must navigate to Sync Screen.
- On invalid credentials, show a non-blocking error message.
- The button must be disabled while request is in progress.

## Validation Rules
- Identifier is required.
- Password is required.

## Non-Functional Requirements
- Follow SOLID by delegating UI logic to use cases and repositories.
- Keep UI free of direct HTTP and persistence details.
- Support future biometric or SSO login extension without changing domain contracts.
