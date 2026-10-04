import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserPage } from '../../hooks/useUserPage';
import { supabase } from '../../lib/supabase';

const StatIcon = ({ kind }: { kind: 'views' | 'clicks' | 'ctr' }) => {
  const paths = {
    views: <><path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    clicks: <><path d="M7 3.5 18.5 14l-5.4.7-.8 5.1L7 3.5Z" /><path d="m14 15 3.5 4" /></>,
    ctr: <><path d="m5 17 5-5 3 3 6-7" /><path d="M14 8h5v5" /></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">{paths[kind]}</svg>;
};

export const DashboardOverview: React.FC = () => {
  const { profile, page, links, loading, error } = useUserPage();
  const [views, setViews] = useState<number>(0);
  const [clicks, setClicks] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [statsError, setStatsError] = useState('');
  const activeLinks = links.filter((link) => link.is_active);

  useEffect(() => {
    let cancelled = false;

    const fetchQuickStats = async () => {
      if (!page) return;
      setStatsError('');
      const [viewsResult, clicksResult] = await Promise.all([
        supabase.from('page_views').select('*', { count: 'exact', head: true }).eq('page_id', page.id),
        supabase.from('link_clicks').select('*', { count: 'exact', head: true }).eq('page_id', page.id),
      ]);
      if (cancelled) return;

      if (viewsResult.error || clicksResult.error) {
        setStatsError("Impossible de charger les statistiques. Vérifiez les autorisations Supabase.");
        return;
      }
      setViews(viewsResult.count ?? 0);
      setClicks(clicksResult.count ?? 0);
    };

    void fetchQuickStats();
    return () => { cancelled = true; };
  }, [page]);

  const publicUrl = profile ? `${window.location.origin}/u/${profile.username}` : '';

  const handleCopyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatsError("Impossible de copier le lien. Copiez l'adresse affichée manuellement.");
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl p-6 text-sm text-slate-400 sm:p-9">Chargement de votre espace...</div>;
  }

  if (error) {
    return <div role="alert" className="mx-auto max-w-3xl p-6 text-sm text-red-300 sm:p-9">{error}</div>;
  }

  const stats = [
    { label: 'Vues de la page', value: views.toLocaleString(), note: 'Depuis la mise en ligne', icon: 'views' as const, tone: 'text-blue-300 bg-blue-400/10' },
    { label: 'Clics sur les liens', value: clicks.toLocaleString(), note: `${activeLinks.length} liens actifs`, icon: 'clicks' as const, tone: 'text-cyan-200 bg-cyan-400/10' },
    { label: 'Taux de clic', value: views > 0 ? `${((clicks / views) * 100).toFixed(1)}%` : '—', note: 'Clics ÷ vues', icon: 'ctr' as const, tone: 'text-indigo-200 bg-indigo-400/10' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-9">
      <div className="flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-300">Votre espace créateur</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Bonjour{profile?.display_name || profile?.username ? `, ${profile.display_name || profile.username}` : ''} <span aria-hidden="true">✦</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">Voici ce qui se passe sur votre page Boostly.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard/page" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08]">
            <span aria-hidden="true">＋</span> Gérer mes liens
          </Link>
          <Link to="/dashboard/appearance" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/15 transition hover:bg-blue-400">
            Personnaliser ma page <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-blue-300/15 bg-gradient-to-br from-[#13254a] via-[#10182c] to-[#101626] p-5 sm:p-7">
        <div aria-hidden="true" className="absolute -right-16 -top-28 h-72 w-72 rounded-full bg-blue-500/15 blur-[70px]" />
        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Votre page est prête à être partagée
            </div>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">Votre univers, à un seul lien.</h2>
            <p className="mt-1 text-xs text-slate-400">Partagez votre page avec votre communauté.</p>
          </div>
          <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-2 sm:flex-row sm:items-center">
            <span className="min-w-0 flex-1 truncate px-2 font-mono text-xs text-blue-200">{publicUrl || 'Chargement du lien...'}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => void handleCopyLink()} disabled={!publicUrl} className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-400 disabled:opacity-50">
                {copied ? 'Copié ✓' : 'Copier le lien'}
              </button>
              {publicUrl && <a href={publicUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-3 py-2 text-center text-xs font-semibold text-slate-300 transition hover:bg-white/[0.06]">Aperçu ↗</a>}
            </div>
          </div>
        </div>
      </section>

      {statsError && <div role="alert" className="rounded-xl border border-amber-300/15 bg-amber-400/[0.07] px-4 py-3 text-xs text-amber-200">{statsError}</div>}

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Performances</h2>
            <p className="mt-1 text-xs text-slate-500">Depuis la création de votre page</p>
          </div>
          <Link to="/dashboard/analytics" className="text-xs font-semibold text-blue-300 transition hover:text-white">Voir les analytics →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-white/[0.07] bg-[#0d1423] p-5 transition hover:border-white/[0.13]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{stat.value}</p>
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tone}`}><StatIcon kind={stat.icon} /></span>
              </div>
              <p className="mt-4 border-t border-white/[0.06] pt-3 text-[10px] text-slate-500">{stat.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="relative overflow-hidden rounded-2xl border border-indigo-300/15 bg-gradient-to-br from-[#151b39] to-[#0d1423] p-6 sm:p-7">
          <div aria-hidden="true" className="absolute -right-8 -top-12 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative flex h-full flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div className="max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/15 bg-indigo-300/[0.08] px-3 py-1.5 text-[10px] font-semibold text-indigo-200">
                <span aria-hidden="true">✦</span> BOOST AI
              </span>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">Les prochaines idées viennent de vos données.</h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">Obtenez des recommandations pour améliorer l’ordre, la présentation et la performance de vos liens.</p>
            </div>
            <Link to="/dashboard/boost-ai" className="relative inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-indigo-50">
              Analyser ma page <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>

        <article className="rounded-2xl border border-white/[0.07] bg-[#0d1423] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">État de votre page</p>
              <p className="mt-1 text-[10px] text-slate-500">Un petit aperçu de votre contenu</p>
            </div>
            <span className="rounded-lg bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-200">En ligne</span>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-lg text-blue-200">↗</span>
            <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-200">Liens actifs</p><p className="mt-1 text-[10px] text-slate-500">Visibles sur votre page</p></div>
            <span className="text-lg font-semibold text-white">{activeLinks.length}</span>
          </div>
          <Link to="/dashboard/page" className="mt-4 inline-flex text-xs font-semibold text-blue-300 transition hover:text-white">Modifier mes liens →</Link>
        </article>
      </section>
    </div>
  );
};
