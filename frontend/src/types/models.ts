export type UUID = string;

export interface Contact {
  id: UUID;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface Category {
  id: UUID;
  name?: string;
  label: string;
  value?: string | null;
  ordering?: number | null;
  color?: string | null;
}

export interface Product {
  id: UUID;
  name: string;
  sku?: string | null;
  price: number;
  cost: number;
  tax_rate?: number | null;
  category_name?: string | null;
  category_id?: UUID | null;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'unpaid' | 'paid' | 'partial';

export interface Order {
  id: UUID;
  contact_id?: UUID | null;
  product_id?: UUID | null;
  quantity?: number | null;
  status?: OrderStatus | null;
  payment_status?: PaymentStatus | null;
  subtotal?: number | null;
  tax?: number | null;
  discount?: number | null;
  total?: number | null;
}
