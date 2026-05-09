# Customers Tab Specification

## Goal
Display the local list of customers as the primary tab in an offline-first workflow.

## Functional Requirements
- Customers tab must be the default selected tab after sync.
- Data source is local database only.
- Screen must show:
  - Search input (by customer name)
  - Customer list items with name and contact summary
  - Empty state when there are no local customers
- Pull-to-refresh should re-read local data.
- Screen must not require internet to render current data.

## Non-Functional Requirements
- UI state handling must remain in presentation layer.
- Domain use case is responsible for retrieving customers.
- Data mapper must shield UI from persistence schema changes.
