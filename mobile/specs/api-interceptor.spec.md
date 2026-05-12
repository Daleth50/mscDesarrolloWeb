# API Interceptor Specification

## Goal
Centralize HTTP request/response handling to enforce session validation, automatically logout on 401 responses, and ensure all API calls (except login) include valid bearer token authentication.

## Architecture
- Interceptor sits between API caller and network layer
- All requests pass through interceptor before being sent
- All responses pass through interceptor before being returned to caller
- Login endpoint bypasses session validation (no token injection)
- All other endpoints require token injection

## Request Interception
### Purpose
Attach authentication bearer token to outgoing requests.

### Behavior
1. If endpoint is `/api/auth/login`, allow request without modification
2. If endpoint is not login:
   - Verify a valid token exists in session storage
   - If token exists, inject `Authorization: Bearer <token>` header
   - If token does not exist, throw authentication error (should not reach this point if AppStateContext prevents it)
3. Forward request to network layer

## Response Interception
### Purpose
Handle HTTP errors, particularly 401 unauthorized responses.

### Behavior
1. If response status is 401 (Unauthorized):
   - Clear session storage immediately
   - Emit logout event or throw specific error with status 401
   - Caller will redirect to login screen
2. If response status is other error (4xx, 5xx):
   - Propagate error as-is to caller
3. If response is success (2xx):
   - Return response to caller

## Error Contract
- All errors thrown by interceptor must preserve original `status` code
- 401 errors must be identifiable by callers (e.g., `err.status === 401`)
- Error messages should be preserved from server response

## Implementation Notes
- Interceptor should be dependency-injected into ApiClient
- Token retrieval should be abstracted (SessionLocalDataSource or similar)
- Logout callback should be injected to trigger session cleanup
- No direct DOM manipulation or route navigation in interceptor
- Interceptor remains agnostic about UI layer concerns

## Example Usage
```typescript
const apiClient = new ApiClient(baseUrl, {
  getToken: () => sessionLocalDataSource.getToken(),
  onUnauthorized: () => {
    // Emit event or call handler to logout
  },
});

// All requests automatically include token and handle 401
const data = await apiClient.get("/api/contacts", token);
```

## Affected Endpoints
### Requires Token
- `GET /api/contacts` (and all contact operations)
- `GET /api/products` (and all product operations)
- `GET /api/bill-accounts` (and all bill account operations)
- `GET /api/pos-orders` (and all order operations)
- All protected endpoints

### No Token Required
- `POST /api/auth/login`
- Future endpoints: register, forgot password, etc.

## Non-Functional Requirements
- Interceptor should not block UI rendering
- No circular dependencies with auth context
- Should be testable in isolation
- Performance impact should be negligible (< 1ms per request)
