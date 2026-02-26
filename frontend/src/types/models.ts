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
export type OrderType = 'cart' | 'sale' | 'quote' | string;

export interface CartItem {
  id: UUID;
  order_id: UUID;
  product_id: UUID;
  product_name?: string | null;
  quantity: number;
  price: number;
  total: number;
  stock_available?: number | null;
}

export interface PosProduct {
  id: UUID;
  name: string;
  sku?: string | null;
  price: number;
  stock_available: number;
}

export interface Order {
  id: UUID;
  contact_id?: UUID | null;
  product_id?: UUID | null;
  quantity?: number | null;
  status?: OrderStatus | null;
  payment_status?: PaymentStatus | null;
  type?: OrderType | null;
  subtotal?: number | null;
  tax?: number | null;
  discount?: number | null;
  total?: number | null;
  items?: CartItem[];
}

export type UserRole = 'admin' | 'seller';

export interface User {
  id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
