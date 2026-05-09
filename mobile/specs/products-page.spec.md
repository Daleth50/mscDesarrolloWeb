# Products Page Specification

## Goal
Allow the salesperson to browse local products and add them to the cart for a specific customer.

## UI Layout
- Page header with back arrow "← Productos" and customer name as title
- Cart button in header (shows item count, visible only when cart has items)
- Search input: "Buscar..."
- Badge showing total product count (e.g. "45 Productos")
- Product cards, each containing:
  - Image placeholder (40×40 px)
  - Product name and category as subtitle
  - Barcode/SKU on the left, price in green on the right
  - When qty = 0: "Agregar" primary button
  - When qty > 0: quantity control (− · qty · +)

## Functional Requirements
- Route: `/pos/products/:customerId`
- Products are loaded from local DB via `GetLocalProductsUseCase`.
- Cart is loaded from local DB via `GetCartUseCase` using `customerId`.
- Search filters by product name or barcode (case-insensitive).
- Tapping "Agregar" or "+" calls `AddToCartUseCase`.
- Tapping "−" decrements quantity; reaching 0 calls `RemoveFromCartUseCase`.
- Cart button navigates to `/pos/cart/:customerId`.

## Non-Functional Requirements
- No network calls; fully offline.
- Cart state updates are reflected immediately in the UI after each use case call.
