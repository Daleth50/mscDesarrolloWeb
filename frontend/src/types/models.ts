export type UUID = string;

export interface Contact {
  id: UUID;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  kind?: 'customer' | 'supplier';
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
  stock_available?: number | null;
  tax_rate?: number | null;
  category_name?: string | null;
  category_id?: UUID | null;
}

export type ProductInventoryMovementType = 'in' | 'out';

export interface ProductInventoryMovement {
  id: UUID;
  product_id: UUID;
  quantity: number;
  movement_type: ProductInventoryMovementType;
  occurred_at?: string | null;
}

export interface ProductMovementsPagination {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ProductInventoryMovementsResponse {
  items: ProductInventoryMovement[];
  pagination: ProductMovementsPagination;
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
  contact_name?: string | null;
  product_id?: UUID | null;
  quantity?: number | null;
  status?: OrderStatus | null;
  payment_status?: PaymentStatus | null;
  payment_method?: PaymentMethod | null;
  type?: OrderType | null;
  subtotal?: number | null;
  tax?: number | null;
  discount?: number | null;
  total?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  items?: CartItem[];
}

export type BillAccountType = 'cash' | 'debt';
export type PaymentMethod = 'cash' | 'transfer';
export type BillAccountMovementType = 'in' | 'out';

export interface BillAccount {
  id: UUID;
  name: string;
  type: BillAccountType;
  balance: number;
}

export interface BillAccountMovement {
  id: UUID;
  order_id?: UUID | null;
  bill_account_id: UUID;
  amount: number;
  movement_type: BillAccountMovementType;
  created_at?: string | null;
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

export interface ReportDailyTotal {
  date: string;
  orders_count: number;
  total: number;
}

export interface ReportTopProduct {
  product_id: UUID;
  product_name: string;
  sku?: string | null;
  quantity: number;
  total: number;
}

export interface ReportTopContact {
  contact_id?: UUID | null;
  contact_name: string;
  orders_count: number;
  total: number;
}

export interface ReportPaymentMethod {
  payment_method: string;
  orders_count: number;
  total: number;
}

export interface ReportBillFlow {
  in_total: number;
  out_total: number;
  net_total: number;
}

export interface ReportsOverview {
  range: {
    from: string;
    to: string;
  };
  totals: {
    sales_count: number;
    sales_total: number;
    sales_avg_ticket: number;
    purchases_count: number;
    purchases_total: number;
    purchases_avg_ticket: number;
    net_total: number;
  };
  sales_by_day: ReportDailyTotal[];
  purchases_by_day: ReportDailyTotal[];
  top_products: ReportTopProduct[];
  top_customers: ReportTopContact[];
  top_suppliers: ReportTopContact[];
  payment_methods: ReportPaymentMethod[];
  bill_flow: ReportBillFlow;
}
