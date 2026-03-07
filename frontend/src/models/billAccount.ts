import type { BillAccountType } from '../types/models';

export type BillAccountFormData = {
  name: string;
  type: BillAccountType;
  balance: string;
};

export type BillAccountMovementFormData = {
  movementType: 'in' | 'out';
  amount: string;
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

export function validateBillAccountMovementForm(formData: BillAccountMovementFormData): string | null {
  if (!['in', 'out'].includes(formData.movementType)) {
    return "El tipo de movimiento debe ser 'in' o 'out'";
  }

  const amount = Number(formData.amount);
  if (Number.isNaN(amount) || amount <= 0) {
    return 'El monto debe ser mayor a 0';
  }

  return null;
}

export function buildBillAccountMovementPayload(formData: BillAccountMovementFormData) {
  return {
    movement_type: formData.movementType,
    amount: Number(formData.amount),
  };
}
