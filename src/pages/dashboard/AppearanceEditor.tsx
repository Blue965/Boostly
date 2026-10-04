import React, { useState } from 'react';
import { useUserPage } from '../../hooks/useUserPage';
import { LivePreview } from '../../components/preview/LivePreview';
import { PRESET_THEMES } from '../../lib/constants';
import { updatePage } from '../../services/pageService';
import { PageConfig } from '../../types/database.types';

export const AppearanceEditor: React.FC = () => {
  const { profile, page, links, loading, error, refresh, setPage } = useUserPage();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const saveChanges = async (updates: Partial<Pick<PageConfig, 'theme' | 'background_color' | 'accent_color' | 'button_style'>>) => {
    if (!page) return;

    const previousPage = page;
    const updatedPage = { ...page, ...updates };
    setPage(updatedPage);
    setSaving(true);
    setSaveError('');

    try {
      await updatePage(page.id, updates);
    } catch (caught) {
      setPage(previousPage);
      setSaveError(caught instanceof Error ? caught.message : "Impossible d'enregistrer l'apparence.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-slate-400">Chargement de votre apparence...</div>;

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-white">Apparence</h1>
        <div role="alert" className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl">
          Impossible de charger votre page : {error}
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-white">Apparence</h1>
        <p className="text-sm text-slate-400">Aucune page n’est associée à ce compte. Actualise les données pour réessayer.</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Actualiser
        </button>
      </div>
    );
  }

  const handleApplyPreset = (preset: typeof PRESET_THEMES[number]) => {
    void saveChanges({ background_color: preset.bg, accent_color: preset.accent, theme: preset.id });
  };

  const handleStyleChange = (key: 'background_color' | 'accent_color' | 'button_style', value: string) => {
    void saveChanges({ [key]: value } as Pick<PageConfig, typeof key>);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Apparence</h1>
          <p className="text-sm text-slate-400">Personnalisez le design et les couleurs de votre page publique.</p>
        </div>

        {saveError && (
          <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-lg">
            Échec de l’enregistrement : {saveError}
          </div>
        )}
        {saving && <p role="status" className="text-xs text-slate-500">Enregistrement des changements...</p>}

        {/* Thèmes prédéfinis */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Thèmes prédéfinis</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleApplyPreset(theme)}
                className={`p-3 rounded-lg border text-left flex flex-col space-y-2 transition ${
                  page.theme === theme.id ? 'border-blue-500 bg-slate-800' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.bg }} />
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                </div>
                <span className="text-xs font-medium text-white">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Couleurs personnalisées */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Couleurs sur mesure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Arrière-plan</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={page.background_color}
                  onChange={(e) => handleStyleChange('background_color', e.target.value)}
                  className="w-10 h-10 rounded border-none cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={page.background_color}
                  onChange={(e) => handleStyleChange('background_color', e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono w-28"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Couleur des boutons</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={page.accent_color}
                  onChange={(e) => handleStyleChange('accent_color', e.target.value)}
                  className="w-10 h-10 rounded border-none cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={page.accent_color}
                  onChange={(e) => handleStyleChange('accent_color', e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono w-28"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Style des boutons */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Style des boutons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'rounded', label: 'Arrondi' },
              { id: 'pill', label: 'Pilule' },
              { id: 'square', label: 'Carré' },
              { id: 'outline', label: 'Contour' }
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleChange('button_style', style.id)}
                className={`p-3 text-center text-xs font-medium rounded-lg border transition ${
                  page.button_style === style.id ? 'border-blue-500 bg-blue-600/10 text-white' : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <LivePreview profile={profile} page={page} links={links} />
      </div>
    </div>
  );
};