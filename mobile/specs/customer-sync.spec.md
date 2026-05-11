# Customer Sync Specification

## Goal
Upload locally created customer records to the backend when connectivity is available, without losing offline-created data during the next initial sync.

## UI/Flow
- The sync tab shows a pending customers counter in addition to any other upload counters.
- Tapping the sync action uploads local customers with `pendingSync: true` to `POST /api/contacts`.
- Each successful upload replaces the local temporary record with the server response.
- Failed uploads remain locally available with `pendingSync: true`.

## Functional Requirements
- New customers created offline must be stored locally with `pendingSync: true` and `geolocation` when available.
- Uploading customers must use the backend endpoint `POST /api/contacts` with `kind: "customer"`.
- The sync process must preserve pending customers when the app performs the initial reference-data sync.
- Initial sync must merge remote customers with any still-pending local customers instead of overwriting them.

## Acceptance Criteria
- A pending customer is uploaded once connectivity is available and appears locally with the server-generated `id`.
- Pending customers are not lost when the user logs in again and initial sync runs.
- The sync UI reports the number of pending customers before and after upload.

## Non-Functional Requirements
- Sync logic must stay in the data/domain layers.
- The presentation layer should only orchestrate user actions and display progress.