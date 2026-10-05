import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '../ui/BrandLogo';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Vue d’ensemble', shortLabel: 'Accueil', path: '/dashboard', icon: 'home' },
  { label: 'Ma page', shortLabel: 'Ma page', path: '/dashboard/page', icon: 'page' },
  { label: 'Mon QR code', shortLabel: 'QR code', path: '/dashboard/qr-code', icon: 'qr' },
  { label: 'Apparence', shortLabel: 'Style', path: '/dashboard/appearance', icon: 'style' },
  { label: 'Statistiques', shortLabel: 'Stats', path: '/dashboard/analytics', icon: 'stats' },
  { label: 'Boost AI', shortLabel: 'Boost AI', path: '/dashboard/boost-ai', icon: 'ai' },
];

function NavIcon({ name }: { name: string }) {
  const common = {
    className: 'h-[18px] w-[18px] shrink-0',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  switch (name) {
    case 'home':
      return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" /></svg>;
    case 'page':
      return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>;
    case 'style':
      return <svg {...common}><path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.4-3.4 1.7 1.7 0 0 1 1.2-2.9H18a3 3 0 0 0 3-3c0-4.8-4-8.7-9-8.7Z" /><path d="M7.5 12h.01M10 7.5h.01M15 8h.01" /></svg>;
    case 'stats':
      return <svg {...common}><path d="M4 19V5M4 19h16" /><path d="m7 14 3-3 3 2 5-6" /><path d="M15 7h3v3" /></svg>;
    case 'qr':
      return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v2M17 20h4M20 18v3" /></svg>;
    default:
      return <svg {...common}><path d="m12 3 1.8 5.4L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.6L12 3Z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></svg>;
  }
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Créateur';
  const isActive = (path: string) => path === '/dashboard'
    ? location.pathname === path
    : location.pathname.startsWith(path);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0a0f1c] md:flex">
        <div className="border-b border-white/[0.07] px-5 py-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span>
              <BrandLogo size="medium" />
              <span className="mt-0.5 block text-[10px] text-slate-500">Creator workspace</span>
            </span>
          </Link>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">Espace de travail</p>
          <nav className="space-y-1.5" aria-label="Navigation du tableau de bord">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                    active
                      ? 'bg-blue-500/[0.13] text-blue-200'
                      : 'text-slate-400 hover:bg-white/[0.045] hover:text-slate-100'
                  }`}
                >
                  {active && <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-blue-400" />}
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {item.icon === 'ai' && <span className="ml-auto rounded-md border border-indigo-400/20 bg-indigo-400/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-indigo-200">Beta</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto space-y-4 p-4">
          <div className="overflow-hidden rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/[0.13] to-indigo-500/[0.04] p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/15 text-blue-200"><NavIcon name="ai" /></div>
            <p className="mt-3 text-xs font-semibold text-white">Une page qui progresse.</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">Découvrez les conseils de Boost AI pour votre audience.</p>
            <Link to="/dashboard/boost-ai" className="mt-3 inline-flex text-[10px] font-semibold text-blue-300 transition hover:text-white">Lancer une analyse →</Link>
          </div>

          <div className="flex items-center gap-3 border-t border-white/[0.07] pt-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-slate-200">{displayName}</span>
              <Link to="/dashboard/subscription" className="mt-0.5 block text-[10px] text-slate-500 transition hover:text-blue-300">Gérer l’abonnement</Link>
            </span>
            <button type="button" onClick={() => void signOut()} aria-label="Déconnexion" title="Déconnexion" className="rounded-lg p-2 text-slate-500 transition hover:bg-red-400/10 hover:text-red-300">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></svg>
            </button>
          </div>
        </div>
      </aside>

      <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-50 flex border-t border-white/[0.08] bg-[#0a0f1c]/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[9px] font-medium transition ${
                active ? 'text-blue-300' : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              <NavIcon name={item.icon} />
              <span className="truncate">{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
