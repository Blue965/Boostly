import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

export const AnalyticsDashboard: React.FC = () => {
  const { summary, loading, error, refresh } = useAnalytics();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-slate-400">Performances de votre page sur les 30 derniers jours.</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          Actualiser
        </button>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
          Impossible de charger les statistiques : {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Vues', value: summary?.views },
          { label: 'Clics', value: summary?.clicks },
          { label: 'Taux de clic (CTR)', value: summary ? `${summary.ctr.toFixed(1)}%` : undefined },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase">{stat.label}</p>
            <p className="text-3xl font-bold text-white">
              {loading ? '—' : typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value ?? '—'}
            </p>
          </div>
        ))}
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">Liens les plus cliqués</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Chargement des statistiques...</p>
        ) : summary?.popularLinks.length ? (
          <div className="divide-y divide-slate-800">
            {summary.popularLinks.map((link) => (
              <div key={link.link_id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{link.title}</p>
                  <p className="text-xs text-slate-500 truncate">{link.url}</p>
                </div>
                <span className="text-sm font-semibold text-blue-400 whitespace-nowrap">
                  {link.clicks.toLocaleString()} clics
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Aucun clic enregistré sur les 30 derniers jours.</p>
        )}
      </section>
    </div>
  );
};