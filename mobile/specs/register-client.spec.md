# Register client (Register Client)

Purpose: Add the ability to register new customers from the mobile app, supporting offline mode and later synchronization.

Main scenario: Create new customer

- Precondition: Authenticated user and on the `Customers` tab.
- Step 1: Tap the **New customer** FAB.
- Step 2: The registration screen opens with fields: *Name* (required), *Phone*, *Email*, *Address*, *Notes*.
- Step 3: The app captures the device's current geolocation (if available) and the user taps **Save**.
- Expected result: A visual confirmation (toast) "Customer saved" is shown and the app returns to the customers list where the new customer appears immediately (local persistence).

Validation and errors

- If *Name* is empty, show an inline error and disable save.
- If *Email* format is invalid, show an inline error.
- If local storage save fails, show an alert with a retry option.

Offline / synchronization behavior

- Save the customer locally with a flag `pendingSync: true` if offline.
- Also save the captured `geolocation` as `{ lat: number, lng: number }` in the contact record when available.
- On next sync, pending customers are sent to the backend and on success are updated locally with the server `id` and `pendingSync: false`.
- While syncing the customer should remain visible in the list and must not be duplicated.

Backend integration

- Expected endpoint: `POST /api/contacts` with payload `{ name, phone, email, address, notes, kind: "customer", geolocation?: { lat, lng } }`.
- On success: update local store with server `id` and clear `pendingSync`.

Acceptance criteria

- Online: Creating a customer results in the customer showing in the list and `pendingSync: false` after successful API response.
- Offline: Creating a customer stores it locally with `pendingSync: true` and `geolocation` when available; it syncs later.

UI notes

- Use a floating action button (FAB) on the customers list to start a new customer flow.
- Follow existing Ionic styles and patterns.

Owner: Mobile team

Date: 2026-05-10
