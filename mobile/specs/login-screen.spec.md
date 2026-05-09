# Login Screen Specification

## Goal
Allow a user to authenticate against the backend API and persist session credentials for offline usage.

## UI Layout
- Centered logo placeholder (56×56 px, rounded)
- Title: "Inicia sesión"
- Form fields: Email, Contraseña
- "Olvidé mi contraseña" link (no-op, placeholder)
- Primary action button: "Inicia sesión"
- Secondary outline button: "Cerrar sesión" (clears any stale session)
- Footer: "¿No tienes cuenta? Regístrate" (no-op, placeholder)

## Functional Requirements
- The screen must be the app entry point when there is no active session.
- On submit, the app must call `POST /api/auth/login`.
- On success, persist token and user profile in local storage.
- On success, navigate to Sync Screen.
- On invalid credentials, show an inline error message inside the form.
- The submit button must be disabled while the request is in progress.
- Pressing Enter on any field submits the form.

## Validation Rules
- Identifier (email) is required.
- Password is required.

## Non-Functional Requirements
- Follow SOLID by delegating UI logic to use cases and repositories.
- Keep UI free of direct HTTP and persistence details.
- Support future biometric or SSO login extension without changing domain contracts.
