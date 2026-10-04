import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/ui/BrandLogo';

const ArrowIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
    <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FeatureIcon = ({ kind }: { kind: 'links' | 'insights' | 'spark' }) => {
  const paths = {
    links: <><path d="M9.5 14.5 14 10a3.18 3.18 0 0 0-4.5-4.5L7 8" /><path d="m10.5 9.5-4.5 4.5a3.18 3.18 0 0 0 4.5 4.5L13 16" /></>,
    insights: <><path d="M4 19V5M4 19h16" /><path d="m7 14 3-3 3 2 5-6" /><path d="M15 7h3v3" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" /></>,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {paths[kind]}
    </svg>
  );
};

export const LandingPage: React.FC = () => (
  <div className="min-h-screen overflow-hidden bg-[#070b16] text-white selection:bg-blue-500/40">
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#070b16]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Boostly accueil">
          <BrandLogo size="small" />
        </Link>
        <nav className="hidden items-center gap-9 md:flex" aria-label="Navigation principale">
          <a href="#features" className="text-sm text-slate-400 transition hover:text-white">Fonctionnalités</a>
          <Link to="/pricing" className="text-sm text-slate-400 transition hover:text-white">Tarifs</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:text-white sm:inline-flex">Connexion</Link>
          <Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-blue-50">
            Commencer <ArrowIcon />
          </Link>
        </div>
      </div>
    </header>

    <main>
      <section className="relative isolate px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:pb-32 lg:pt-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-180px] h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />
          <div className="absolute right-[-160px] top-[280px] h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="hero-grid absolute inset-0 opacity-30" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1fr_0.92fr]">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-3.5 py-2 text-xs font-semibold text-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>
              Votre présence en ligne, enfin réunie
            </div>

            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-[76px]">
              Une page.
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">Tout votre univers.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Rassemblez vos liens, affirmez votre style et découvrez ce qui intéresse vraiment votre communauté.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-400">
                Créer ma page gratuitement <ArrowIcon />
              </Link>
              <a href="#features" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07]">
                Découvrir Boostly
              </a>
            </div>
            <div className="mt-7 flex items-center gap-3 text-xs text-slate-500">
              <div className="flex -space-x-2">
                {['bg-indigo-400', 'bg-cyan-400', 'bg-fuchsia-400', 'bg-blue-400'].map((color, index) => (
                  <span key={color} className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#080c17] ${color} text-[9px] font-bold text-slate-950`}>
                    {['C', 'M', 'A', 'B'][index]}
                  </span>
                ))}
              </div>
              <span>Tout ce qu’il faut pour créer votre page, au même endroit.</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
            <div aria-hidden="true" className="absolute inset-8 rounded-[40px] bg-blue-500/20 blur-[90px]" />
            <div className="relative rounded-[28px] border border-white/10 bg-[#101626]/90 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-4">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-3 pb-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-300/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                </div>
                <span className="rounded-md border border-white/[0.08] bg-black/20 px-3 py-1 text-[10px] text-slate-500">boostly.me / creator</span>
                <span className="w-10" />
              </div>
              <div className="grid gap-3 p-3 sm:grid-cols-[1fr_0.8fr] sm:p-4">
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-[#0b1120] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Votre espace</p>
                        <p className="mt-1 text-sm font-semibold text-white">Vue d’ensemble</p>
                      </div>
                      <span className="rounded-lg bg-blue-500/15 p-2 text-blue-300"><FeatureIcon kind="insights" /></span>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-white/[0.035] p-3">
                        <p className="text-[10px] text-slate-500">Vues</p>
                        <p className="mt-1 text-xl font-semibold tracking-tight">2,480</p>
                        <p className="mt-1 text-[10px] text-emerald-300">Cette période</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.035] p-3">
                        <p className="text-[10px] text-slate-500">Clics</p>
                        <p className="mt-1 text-xl font-semibold tracking-tight">816</p>
                        <p className="mt-1 text-[10px] text-cyan-300">Engagement</p>
                      </div>
                    </div>
                    <div className="mt-4 flex h-20 items-end gap-1.5">
                      {[30, 42, 35, 59, 47, 70, 50, 80, 62, 92, 68, 100, 78, 88].map((height, index) => (
                        <span key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-600/70 to-cyan-300" style={{ height: `${height}%`, opacity: 0.45 + (index / 14) * 0.55 }} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/15 to-indigo-500/[0.04] p-4">
                    <div className="flex items-center gap-2 text-blue-200"><FeatureIcon kind="spark" /><span className="text-xs font-semibold">Boost AI</span></div>
                    <p className="mt-3 text-xs leading-5 text-slate-300">Votre lien portfolio attire le plus de clics. Placez-le en première position.</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full w-3/4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" /></div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-full max-w-[190px] rounded-[28px] border-[5px] border-[#27334c] bg-[#090e1b] p-2 shadow-xl shadow-black/40 sm:max-w-none">
                    <div className="rounded-[20px] bg-gradient-to-b from-[#1d2f5a] via-[#111a31] to-[#0b1020] px-3 pb-4 pt-6">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-black text-white ring-4 ring-white/10">A</div>
                      <p className="mt-3 text-center text-xs font-bold">Alex Morgan</p>
                      <p className="mt-1 text-center text-[9px] text-slate-400">Créateur · Design & vidéo</p>
                      <div className="mt-5 space-y-2">
                        {[
                          { name: 'Mon portfolio', mark: '↗' },
                          { name: 'Dernière vidéo', mark: '▶' },
                          { name: 'Instagram', mark: '◎' },
                          { name: 'Ma newsletter', mark: '✳' },
                        ].map((link) => (
                          <div key={link.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-2 text-[9px] font-semibold">
                            <span>{link.name}</span><span className="text-cyan-200">{link.mark}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-5 text-center text-[8px] tracking-[0.18em] text-slate-600">MADE WITH BOOSTLY</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Aperçu en direct</span>
                <span>boostly.me/alexmorgan</span>
              </div>
            </div>
            <div className="absolute -left-5 top-1/3 hidden rounded-xl border border-white/10 bg-[#121a2b] px-3 py-2.5 shadow-xl sm:block">
              <p className="text-[9px] text-slate-500">Taux de clic</p><p className="text-sm font-bold text-cyan-200">32,9%</p>
            </div>
            <div className="absolute -right-4 bottom-10 hidden rounded-xl border border-white/10 bg-[#121a2b] px-3 py-2.5 shadow-xl sm:block">
              <p className="text-[9px] text-slate-500">Tout est à jour</p><p className="text-xs font-semibold text-white">✦ Votre page est prête</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-white/[0.07] bg-white/[0.018] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-300">Pensé pour vous</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Votre présence, en mieux.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">Tout ce qu’il faut pour présenter votre univers et comprendre l’engagement de votre audience.</p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { icon: 'links' as const, number: '01', title: 'Un seul lien. Toute votre histoire.', description: 'Réunissez vos réseaux, vos vidéos, votre portfolio et vos projets dans une page qui vous ressemble.' },
              { icon: 'insights' as const, number: '02', title: 'Des chiffres qui ont du sens.', description: 'Suivez vos vues, vos clics et vos liens les plus populaires pour mieux comprendre votre communauté.' },
              { icon: 'spark' as const, number: '03', title: 'Des idées pour progresser.', description: 'Boost AI transforme les performances de votre page en recommandations concrètes et faciles à appliquer.' },
            ].map((feature) => (
              <article key={feature.number} className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1423] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#101a2d] sm:p-7">
                <span className="absolute right-5 top-4 text-5xl font-black tracking-tighter text-white/[0.035]">{feature.number}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/[0.08] text-blue-200"><FeatureIcon kind={feature.icon} /></span>
                <h3 className="mt-7 text-lg font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-blue-300/15 bg-gradient-to-r from-blue-500/[0.12] via-indigo-500/[0.08] to-cyan-400/[0.08] p-7 sm:flex-row sm:p-9">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Prêt à donner plus de portée à vos liens ?</h3>
              <p className="mt-2 text-sm text-slate-400">Lancez votre page Boostly en quelques minutes.</p>
            </div>
            <Link to="/signup" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50">
              Créer mon compte <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </main>

    <footer className="px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
        <Link to="/" aria-label="Boostly accueil" className="transition opacity-80 hover:opacity-100"><BrandLogo size="small" wordmarkClassName="text-slate-300" /></Link>
        <p>© {new Date().getFullYear()} Boostly. Fait pour les créateurs.</p>
        <div className="flex gap-5"><Link to="/pricing" className="transition hover:text-white">Tarifs</Link><Link to="/login" className="transition hover:text-white">Connexion</Link></div>
      </div>
    </footer>
  </div>
);
