import React, { useState } from 'react';
import { useUserPage } from '../../hooks/useUserPage';
import { LivePreview } from '../../components/preview/LivePreview';
import { PRESET_THEMES } from '../../lib/constants';
import { supabase } from '../../lib/supabase';

export const AppearanceEditor: React.FC = () => {
  const { profile, page, links, setPage } = useUserPage();
  const [saving, setSaving] = useState(false);

  if (!page) return <div className="p-6 text-slate-400">Chargement...</div>;

  const handleApplyPreset = async (preset: typeof PRESET_THEMES[0]) => {
    const updated = { ...page, background_color: preset.bg, accent_color: preset.accent, theme: preset.id };
    setPage(updated);
    await supabase.from('pages').update({ background_color: preset.bg, accent_color: preset.accent, theme: preset.id }).eq('id', page.id);
  };

  const handleStyleChange = async (key: string, value: any) => {
    const updated = { ...page, [key]: value };
    setPage(updated);
    await supabase.from('pages').update({ [key]: value }).eq('id', page.id);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Apparence</h1>
          <p className="text-sm text-slate-400">Personnalisez le design et les couleurs de votre page publique.</p>
        </div>

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