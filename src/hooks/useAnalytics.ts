import { useCallback, useEffect, useState } from 'react';
import { getAnalyticsSummary } from '../services/analyticsService';
import { AnalyticsSummary } from '../types/database.types';
import { useUserPage } from './useUserPage';

export function useAnalytics(days = 30) {
  const { page, loading: pageLoading } = useUserPage();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!page) {
      setSummary(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setSummary(await getAnalyticsSummary(page.id, days));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible de charger les statistiques.');
    } finally {
      setLoading(false);
    }
  }, [days, page]);

  useEffect(() => {
    if (!pageLoading) void refresh();
  }, [pageLoading, refresh]);

  return { summary, loading: pageLoading || loading, error, refresh };
}