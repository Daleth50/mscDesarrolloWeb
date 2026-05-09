# Spec: POS Product Selection

## Overview

After selecting a customer the seller browses the locally-stored product catalogue, adds items to the cart, and proceeds to checkout. All operations are fully offline.

## Route

`/pos/products/:customerId`

## Entry point

`CustomersTabPage` — tapping any customer row navigates to this route with that customer's `id`.

## Features

### Product list
- Loaded from `ProductsLocalDataSource.getProducts()` (localforage).
- Shows: name, price, stock count, category name.
- Search bar filters by name or barcode (case-insensitive, client-side).

### Add / remove controls
- If the product has **0** items in cart → shows an **Add** button.
- If the product has **≥ 1** items in cart → shows `−  qty  +` inline controls.
- Tapping `+` increments qty by 1.
- Tapping `−` decrements qty; when qty reaches 0 the item is removed from cart.

### Cart badge
- A cart icon in the header and a FAB button at the bottom-right show the total item count.
- Both are disabled / hidden when the cart is empty.
- Tapping either navigates to `/pos/cart/:customerId`.

## Domain layer

```
GetLocalProductsUseCase.execute()
  └─ ProductsLocalDataSource.getProducts()

AddToCartUseCase.execute(customerId, productId, name, price, qty)
  └─ CartRepositoryImpl.upsertItem()
       └─ CartLocalDataSource.upsertItem()   ← persists to localforage

RemoveFromCartUseCase.execute(customerId, productId)
  └─ CartRepositoryImpl.removeItem()
       └─ CartLocalDataSource.removeItem()
```

## State persistence

The cart is stored in the `carts` localforage store under the key `cart:<customerId>`. It survives page reloads.
