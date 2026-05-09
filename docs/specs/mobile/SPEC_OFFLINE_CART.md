# Spec: Offline Cart

## Overview

The cart is a persistent, per-customer shopping basket stored in IndexedDB. It is created, updated, and read entirely offline with no backend calls.

## Route

`/pos/cart/:customerId`

## Data model

```ts
interface CartItem {
  productId: string;
  productName: string;
  price: number;       // snapshot at time of adding
  quantity: number;
}

interface Cart {
  customerId: string;
  items: CartItem[];
  createdAt: string;   // ISO timestamp
  updatedAt: string;   // ISO timestamp, updated on every mutation
}
```

Price is captured as a snapshot when the item is added; subsequent price changes on the server do not affect an open cart.

## Storage

- Store name: `carts` (localforage instance)
- Key pattern: `cart:<customerId>`
- One active cart per customer at a time.

## Features

### Item list
- Displays each item: name, unit price, `−  qty  +` controls, trash icon.
- `−` decrements qty; reaching 0 removes the item entirely.
- `+` increments qty with no upper bound (stock validation is deferred to sync).
- Trash icon removes the item immediately.

### Order total
- Computed client-side: `sum(item.price × item.quantity)`.
- Shown as a formatted currency value at the bottom of the list.

### Navigation
- **Back** → returns to product selection (`/pos/products/:customerId`).
- **Complete sale** → navigates to `/pos/complete/:customerId`. Only enabled when cart is non-empty.

## Domain layer

```
GetCartUseCase.execute(customerId)
AddToCartUseCase.execute(customerId, productId, name, price, qty)
RemoveFromCartUseCase.execute(customerId, productId)
ClearCartUseCase.execute(customerId)   ← called after sale is confirmed
  └─ CartRepositoryImpl → CartLocalDataSource (localforage)
```

## Cart lifecycle

1. Created implicitly when the first item is added.
2. Updated on every add / remove.
3. Deleted by `ClearCartUseCase` after `CompleteSaleUseCase` succeeds.
