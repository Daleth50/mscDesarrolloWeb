import type { UUID, OrderStatus, PaymentStatus } from '../types/models';

export type OrderFormData = {
  contact_id: UUID | '';
  product_id: UUID | '';
  quantity: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
};

export const ORDER_NUMERIC_FIELDS = new Set<keyof OrderFormData>([
  'quantity',
  'subtotal',
  'tax',
  'discount',
  'total',
]);
