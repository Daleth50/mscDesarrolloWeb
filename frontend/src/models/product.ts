import type { UUID } from '../types/models';

export type ProductFormData = {
  name: string;
  sku: string;
  price: number;
  cost: number;
  tax_rate: number;
  category_id: UUID;
};

export const PRODUCT_NUMERIC_FIELDS = new Set<keyof ProductFormData>([
  'price',
  'cost',
  'tax_rate',
]);

export function validateProductForm(formData: ProductFormData): string | null {
  if (!formData.name.trim()) return 'El nombre es requerido';
  if (!formData.category_id) return 'La categoría es requerida';
  return null;
}
