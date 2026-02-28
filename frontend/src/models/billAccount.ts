import type { BillAccountType } from '../types/models';

export type BillAccountFormData = {
  name: string;
  type: BillAccountType;
  balance: string;
};

export function validateBillAccountForm(formData: BillAccountFormData): string | null {
  if (!formData.name.trim()) {
    return 'El nombre es requerido';
  }
  if (!['cash', 'debt'].includes(formData.type)) {
    return "El tipo debe ser 'cash' o 'debt'";
  }
  if (Number.isNaN(Number(formData.balance))) {
    return 'El balance debe ser un número válido';
  }
  return null;
}

export function buildBillAccountPayload(formData: BillAccountFormData) {
  return {
    name: formData.name.trim(),
    type: formData.type,
    balance: Number(formData.balance),
  };
}
