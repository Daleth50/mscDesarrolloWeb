# Cart Page Specification

## Goal
Review and adjust the current order before completing the sale.

## UI Layout
- Page header with back arrow "← Crear venta"
- Cart item cards, each containing:
  - Image placeholder (40×40 px)
  - Product name, unit price as subtitle
  - "Eliminar" link to remove item
  - Line total (price × qty) and quantity control (− · qty · +)
- Order summary box:
  - Subtotal
  - Descuento (always $0.00 until discount feature is implemented)
  - Total (in green)
- Fixed bottom action bar with two buttons: "Efectivo" (outline) | "Cobrar" (primary)

## Functional Requirements
- Route: `/pos/cart/:customerId`
- Cart is loaded from local DB via `GetCartUseCase`.
- Quantity changes call `AddToCartUseCase`; reaching 0 calls `RemoveFromCartUseCase`.
- "Eliminar" calls `RemoveFromCartUseCase`.
- "Cobrar" navigates to `/pos/complete/:customerId`.
- "Efectivo" is a placeholder (no-op) until payment method selection is implemented.
- Empty cart state shows a message instead of the item list and hides the action bar.

## Non-Functional Requirements
- No network calls; fully offline.
- Bottom action bar uses `position: fixed` so it stays visible while scrolling long carts.
