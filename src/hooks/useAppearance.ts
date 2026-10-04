import { useCallback, useState } from 'react';
import { updatePage } from '../services/pageService';
import { PageConfig } from '../types/database.types';
import { useUserPage } from './useUserPage';

type AppearanceUpdates = Partial<
  Pick<PageConfig, 'theme' | 'background_color' | 'accent_color' | 'button_style' | 'font_family' | 'hide_branding'>
>;

export function useAppearance() {
  const { page, setPage } = useUserPage();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAppearance = useCallback(async (updates: AppearanceUpdates) => {
    if (!page) throw new Error('Aucune page à personnaliser.');

    setSaving(true);
    setError(null);
    try {
      await updatePage(page.id, updates);
      setPage({ ...page, ...updates });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Impossible d'enregistrer l'apparence.";
      setError(message);
      throw caught;
    } finally {
      setSaving(false);
    }
  }, [page, setPage]);

  return { page, saving, error, saveAppearance };
}