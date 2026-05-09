export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Cart {
  customerId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
