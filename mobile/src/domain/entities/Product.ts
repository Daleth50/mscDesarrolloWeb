export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number | null;
  stock: number;
  category_id: string | null;
  category_name: string | null;
  barcode: string | null;
  image_url: string | null;
}
