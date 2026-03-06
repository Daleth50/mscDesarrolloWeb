import type { ChipProps } from '@mui/material/Chip';

export function getOrderStatusColor(status?: string | null): ChipProps['color'] {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
}

export function getOrderStatusLabel(status?: string | null): string {
  switch (status) {
    case 'completed':
      return 'Completada';
    case 'pending':
      return 'Pendiente';
    case 'cancelled':
      return 'Cancelada';
    default:
      return '-';
  }
}

export function getPaymentStatusColor(status?: string | null): ChipProps['color'] {
  switch (status) {
    case 'paid':
      return 'success';
    case 'unpaid':
      return 'error';
    case 'partial':
      return 'warning';
    default:
      return 'default';
  }
}

export function getPaymentStatusLabel(status?: string | null): string {
  switch (status) {
    case 'paid':
      return 'Pagado';
    case 'unpaid':
      return 'No pagado';
    case 'partial':
      return 'Parcial';
    case 'pending':
      return 'Pendiente';
    default:
      return '-';
  }
}