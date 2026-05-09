# Spec: Complete Sale (Offline)

## Overview

The seller reviews the order summary, selects a payment method, and confirms the sale. The sale is saved locally with status `pending_sync` for later upload to the backend. No internet connection is required.

## Route

`/pos/complete/:customerId`

## Features

### Order summary
- Lists all cart items: name, `qty × unit price`, line total.
- Shows grand total at the bottom.

### Payment method selection
- Displays all locally-stored bill accounts (`GetLocalBillAccountsUseCase`).
- Each account shows its name and type label (`Cash` or `Credit / Debt`).
- User selects one via radio buttons; first account is pre-selected.

### Confirm button
- Disabled until a payment account is selected.
- Shows a spinner while saving.
- On success:
  - Clears the cart (`ClearCartUseCase`).
  - Shows a full-screen success state with total and a **Back to customers** button.
- On error: shows an inline error message; user can retry.

## Sale data model

```ts
interface Sale {
  id: string;           // crypto.randomUUID()
  customerId: string;
  items: CartItem[];
  billAccountId: string;
  total: number;
  status: "pending_sync" | "synced";
  createdAt: string;    // ISO timestamp
}
```

## Storage

- Store name: `sales` (localforage instance)
- Key: `sales` → array of `Sale` objects (append-only locally).
- `pending_sync` sales will be uploaded to the backend in a future sync step.

## Domain layer

```
CompleteSaleUseCase.execute({ customerId, items, billAccountId, total })
  └─ SalesLocalDataSource.saveSale(sale)   ← appends to localforage

ClearCartUseCase.execute(customerId)
  └─ CartLocalDataSource.clearCart(customerId)
```

## Validations (client-side)

- Cart must not be empty.
- A bill account must be selected.

## Future work

- `SyncSalesUseCase`: uploads `pending_sync` sales to `POST /api/orders` and marks them as `synced`.
- Stock deduction should be validated server-side on upload.
