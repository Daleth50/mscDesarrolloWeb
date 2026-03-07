const DEFAULT_LOCALE = 'es-ES';

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(value: number | string | null | undefined, locale = DEFAULT_LOCALE): string {
  return `$ ${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value))}`;
}

export function formatInteger(value: number | string | null | undefined, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(toNumber(value));
}
