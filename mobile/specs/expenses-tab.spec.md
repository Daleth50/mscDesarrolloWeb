# Spec: Expenses Tab

## Overview
The seller views a list of locally-stored expenses and can create new expenses to be synced later. Expenses are independent of sales and can be synchronized in any order.

## Routes
- `/tabs/expenses` - List of expenses
- `/expenses/create` - Create expense form

## Features

### Expenses List Page

#### Layout
- **Header**: "Gastos" title with toolbar
- **Empty state**: "No hay gastos registrados" message when list is empty
- **Expense items**: For each expense, display:
  - Amount (large, emphasized, currency format)
  - Note (if present, truncated to 2 lines)
  - Created date and time (relative: "hace 2 horas")
  - Status indicator badge: "pending" (orange) or "synced" (green)
- **FAB (Floating Action Button)**: Green button at bottom-right, labeled "+" or icon, routes to `/expenses/create`

#### Behavior
- List sorted by `createdAt` in descending order (newest first)
- Pull-to-refresh: reloads local expense list from storage
- Tap on expense item: future feature (detail view - not implemented now)
- FAB click: navigate to create expense form

#### Loading & Error States
- Initial load: show spinner
- Storage error: show inline error with retry button
- Success: display list

---

### Create Expense Form Page

#### Layout
- **Header**: "Nuevo Gasto" title with back button
- **Form fields**:
  1. **Amount** (required)
     - Input type: number
     - Placeholder: "0.00"
     - Currency symbol prefix: "$"
     - Min value: 0.01
     - Validation: must be > 0
  2. **Note** (optional)
     - Input type: textarea
     - Placeholder: "Descripción (opcional)"
     - Max 255 characters
  3. **Location** (optional, auto-capture)
     - Display: "📍 Ubicación capturada" or "📍 Ubicación no disponible"
     - Silently attempt to capture on form load via Geolocation API
     - Include latitude and longitude in payload if available

#### Form Actions
- **Save button**
  - Disabled until amount is valid (> 0)
  - Shows spinner while submitting
  - On success: 
    - Show toast: "Gasto registrado"
    - Navigate back to expenses list
    - New expense appears at top of list with `pending_sync` status
  - On error:
    - Show inline error message
    - Keep form data intact
    - User can retry

#### Validations (client-side)
- Amount is required
- Amount must be > 0
- Amount must be a valid number
- Note max 255 chars (auto-truncate or warn)

---

## Expense Data Model

```typescript
interface Expense {
  id: string;                    // crypto.randomUUID()
  amount: number;                // e.g., 50.50
  note?: string;                 // optional description
  latitude?: number;             // optional geolocation
  longitude?: number;            // optional geolocation
  status: "pending_sync" | "synced";
  createdAt: string;             // ISO timestamp, local time
}
```

---

## Storage

- Store name: `expenses` (localforage instance)
- Key: `expenses` → array of `Expense` objects (append-only locally)
- Persists across app restarts
- Each new expense starts with `status: "pending_sync"`

---

## Domain Layer

```
CreateExpenseUseCase.execute({ amount, note, latitude, longitude })
  └─ ExpenseLocalDataSource.saveExpense(expense)
     └─ localforage.setItem('expenses', [...existing, newExpense])

GetLocalExpensesUseCase.execute()
  └─ ExpenseLocalDataSource.getAll()
     └─ returns expenses sorted by createdAt desc

SyncPendingExpensesUseCase.execute()
  └─ filter expenses with status "pending_sync"
  └─ POST /api/expenses (batch or individual)
  └─ on success: ExpenseLocalDataSource.updateStatus(id, "synced")
```

---

## API Integration

### Create Expense (Backend)
- Endpoint: `POST /api/expenses`
- Payload:
  ```json
  {
    "amount": 50.50,
    "note": "Gasolina para motocicleta",
    "latitude": 4.7110,
    "longitude": -74.0721,
    "status": "success"
  }
  ```
- Response: `{ id, amount, note, latitude, longitude, status, created_at, updated_at }`

### Sync Pending Expenses
- Endpoint: `POST /api/expenses/sync` (or batch POST as above)
- Payload: array of pending expenses
- On success: mark each as `synced` in local storage
- On error: leave as `pending_sync`, show error toast, allow retry

---

## Future Work

- Detail view for individual expenses
- Edit/delete expenses (if status is `pending_sync`)
- Expense categories/tags
- Recurring expenses
- Expense reports and filtering
- Integration with bill accounts (tie expenses to payment source)
