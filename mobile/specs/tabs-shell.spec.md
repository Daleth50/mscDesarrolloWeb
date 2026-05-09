# Tabs Shell Specification

## Goal
Provide a post-sync tabbed navigation shell where Customers is the main working entry.

## Functional Requirements
- Tabs are accessible only when user has an active session and successful initial sync.
- Include at least:
  - Customers tab (default)
  - Settings tab
- Settings tab must include:
  - Last sync timestamp
  - Manual sync action
  - Logout action
- Logout must clear local session and return to Login Screen.

## Non-Functional Requirements
- Route guards must enforce session and sync prerequisites.
- Navigation decisions should use application state from dedicated services, not ad-hoc checks.
