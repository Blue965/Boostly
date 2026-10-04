import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserPage } from '../../hooks/useUserPage';
import { supabase } from '../../lib/supabase';

export const DashboardOverview: React.FC = () => {
  const { profile, page, links } = useUserPage();
  const [views, setViews] = useState<number>(0);
  const [clicks, setClicks] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchQuickStats = async () => {
      if (!page) return;
      const { count: vCount } = await supabase.from('page_views').select('*', { count: 'exact', head: true }).eq('page_id', page.id);
      const { count: cCount } = await supabase.from('link_clicks').select('*', { count: 'exact', head: true }).eq('page_id', page.id);
      setViews(vCount || 0);
      setClicks(cCount || 0);
    };
    fetchQuickStats();
  }, [page]);

  const publicUrl = `${window.location.origin}/u/${profile?.username || ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* En-tête de bienvenue */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Bonjour, {profile?.display_name || profile?.username}</h1>
          <p className="text-sm text-slate-400">Voici les performances réelles de votre page Boostly.</p>
        </div>

        {/* Bloc partage rapide */}
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3">
          <span className="text-xs text-blue-400 font-mono font-medium truncate max-w-[200px]">
            {publicUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
          >
            {copied ? 'Copié !' : 'Copier'}
          </button>
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium transition"
          >
            Voir
          </a>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <p className="text-xs font-medium text-slate-400 uppercase">Vues</p>
          <p className="text-3xl font-bold text-white">{views.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <p className="text-xs font-medium text-slate-400 uppercase">Clics</p>
          <p className="text-3xl font-bold text-white">{clicks.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <p className="text-xs font-medium text-slate-400 uppercase">Taux de clic (CTR)</p>
          <p className="text-3xl font-bold text-white">
            {views > 0 ? `${((clicks / views) * 100).toFixed(1)}%` : '—'}
          </p>
        </div>
      </div>

      {/* Section Boost AI Callout */}
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Boost AI Assistant</h2>
          <p className="text-xs text-slate-300 max-w-lg">
            Découvrez comment optimiser votre page grâce à l'analyse algorithmique de vos vraies données.
          </p>
        </div>
        <Link
          to="/dashboard/boost-ai"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shrink-0"
        >
          Analyser ma page
        </Link>
      </div>
    </div>
  );
};