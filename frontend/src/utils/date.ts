export function formatDateTime(value?: string | Date | null, locale = 'es-ES'): string {
  if (!value) {
    return '-';
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleString(locale);
}