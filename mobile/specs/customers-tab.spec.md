# Customers Tab Specification

## Goal
Display the local list of customers as the primary entry point for creating sales.

## UI Layout
- Page header with title "Elige un cliente"
- Search input: "Buscar cliente..."
- Customer list grouped alphabetically by first letter of name
- Each section shows a letter header followed by tappable customer rows
- Empty state when no customers match the search or local DB is empty

## Functional Requirements
- Default selected tab after initial sync.
- Data source is local database only — no internet required to render.
- Alphabetical grouping is computed client-side from the full local list.
- Search filters by customer name (case-insensitive, prefix-anywhere match).
- Tapping a customer navigates to `/pos/products/:customerId`.
- Pull-to-refresh re-reads local data.

## Non-Functional Requirements
- UI state handling remains in the presentation layer.
- `GetLocalCustomersUseCase` is responsible for retrieving customers.
- Data mapper shields UI from persistence schema changes.
