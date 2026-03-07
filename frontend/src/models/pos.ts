import type { PosProduct } from '../types/models';

export function filterPosProducts(products: PosProduct[], searchTerm: string): PosProduct[] {
  const term = searchTerm.trim().toLowerCase();
  if (!term) {
    return products;
  }

  return products.filter((product) => {
    const name = product.name.toLowerCase();
    const sku = (product.sku || '').toLowerCase();
    return name.includes(term) || sku.includes(term);
  });
}

export function parsePositiveInteger(value: string, fieldLabel = 'La cantidad'): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldLabel} debe ser un entero mayor a 0.`);
  }
  return parsed;
}
