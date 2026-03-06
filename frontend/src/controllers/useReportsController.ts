import { useEffect, useState } from 'react';
import { reportService } from '../services/reportService';
import { getErrorMessage } from '../utils/error';
import type { ReportsOverview } from '../types/models';

const DEFAULT_TOP_LIMIT = '10';

function formatDateInput(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDefaultDateRange() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    from: formatDateInput(firstDay),
    to: formatDateInput(today),
  };
}

export function useReports() {
  const defaultRange = getDefaultDateRange();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<ReportsOverview | null>(null);

  const [fromDate, setFromDate] = useState(defaultRange.from);
  const [toDate, setToDate] = useState(defaultRange.to);
  const [topLimit, setTopLimit] = useState(DEFAULT_TOP_LIMIT);

  useEffect(() => {
    loadOverview(defaultRange.from, defaultRange.to, DEFAULT_TOP_LIMIT);
  }, []);

  const loadOverview = async (from: string, to: string, rawTopLimit: string) => {
    try {
      setLoading(true);
      setError(null);

      const parsedLimit = Number(rawTopLimit);
      if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
        throw new Error('Top de resultados debe ser un entero mayor que 0.');
      }

      const data = await reportService.getOverview({
        from,
        to,
        topLimit: parsedLimit,
      });

      setOverview(data);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    if (!fromDate || !toDate) {
      setError('Debes indicar fecha inicial y fecha final.');
      return;
    }

    if (fromDate > toDate) {
      setError('La fecha inicial no puede ser mayor que la fecha final.');
      return;
    }

    await loadOverview(fromDate, toDate, topLimit);
  };

  return {
    loading,
    error,
    overview,
    fromDate,
    toDate,
    topLimit,
    setFromDate,
    setToDate,
    setTopLimit,
    applyFilters,
  };
}
