const DEFAULT_LOCALE = 'es-ES';

function parseDateValue(value?: string | Date | null): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const trimmedValue = String(value).trim();
  if (!trimmedValue) {
    return null;
  }

  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
  const parsed = dateOnlyPattern.test(trimmedValue)
    ? new Date(`${trimmedValue}T00:00:00`)
    : new Date(trimmedValue);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(value?: string | Date | null, locale = DEFAULT_LOCALE): string {
  const parsed = parseDateValue(value);
  if (!parsed) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed);
}

export function formatDateTime(value?: string | Date | null, locale = DEFAULT_LOCALE): string {
  const parsed = parseDateValue(value);
  if (!parsed) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsed);
}