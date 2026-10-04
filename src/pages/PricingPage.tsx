import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/ui/BrandLogo';

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none">
    <path d="m4.5 10.2 3.4 3.4 7.6-7.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PricingPage: React.FC = () => (
  <div className="min-h-screen overflow-hidden bg-[#070b16] text-white">
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#070b16]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo size="small" />
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="hidden rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:text-white sm:inline-flex">Accueil</Link>
          <Link to="/login" className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.06]">Connexion</Link>
          <Link to="/signup" className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-blue-50">Créer un compte</Link>
        </div>
      </div>
    </header>

    <main className="relative isolate px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <div className="absolute left-1/2 top-[-210px] h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[130px]" />
      </div>
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-300">Tarifs</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Simple aujourd’hui.<br /><span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">Prêt pour demain.</span></h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">Commencez gratuitement, créez votre page et découvrez les outils Boostly à votre rythme.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-[10px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Pas de carte bancaire pour commencer
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-white/[0.09] bg-[#0d1423] p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Pour démarrer</span>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Free</h2>
              </div>
              <span className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold text-slate-300">Toujours gratuit</span>
            </div>
            <div className="mt-7 flex items-baseline gap-2"><span className="text-5xl font-semibold tracking-[-0.06em]">0 $</span><span className="text-xs text-slate-500">/ mois</span></div>
            <p className="mt-3 text-xs leading-5 text-slate-400">Les essentiels pour réunir vos liens et commencer à partager.</p>
            <ul className="mt-7 flex-1 space-y-4 border-t border-white/[0.07] pt-6 text-xs text-slate-300">
              {['Une page publique personnalisable', 'Jusqu’à 10 liens', 'Thèmes et styles essentiels', 'Statistiques de votre page', 'Votre page hébergée par Boostly'].map((item) => (
                <li key={item} className="flex items-center gap-3"><span className="text-emerald-300"><Check /></span>{item}</li>
              ))}
            </ul>
            <Link to="/signup" className="mt-8 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] px-5 py-3 text-xs font-bold text-white transition hover:border-white/20 hover:bg-white/[0.08]">Commencer gratuitement <span className="ml-2">→</span></Link>
          </article>

          <article className="relative flex flex-col overflow-hidden rounded-2xl border border-blue-300/25 bg-gradient-to-b from-[#131f3b] to-[#0d1423] p-6 shadow-2xl shadow-blue-950/20 sm:p-8">
            <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/15 blur-[70px]" />
            <div className="absolute right-6 top-6 rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-blue-200">Bientôt</div>
            <div className="relative flex items-start justify-between pr-16">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">Pour aller plus loin</span>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Pro</h2>
              </div>
            </div>
            <div className="relative mt-7 flex items-baseline gap-2"><span className="text-5xl font-semibold tracking-[-0.06em]">4,99 $</span><span className="text-xs text-slate-500">/ mois</span></div>
            <p className="relative mt-3 text-xs leading-5 text-slate-400">Plus de contrôle, plus d’insights et davantage de place pour grandir.</p>
            <ul className="relative mt-7 flex-1 space-y-4 border-t border-white/[0.07] pt-6 text-xs text-slate-200">
              {['Liens illimités', 'Personnalisation avancée', 'Statistiques étendues', 'Analyses Boost AI', 'Retrait du branding Boostly'].map((item) => (
                <li key={item} className="flex items-center gap-3"><span className="text-cyan-200"><Check /></span>{item}</li>
              ))}
            </ul>
            <div className="relative mt-8 rounded-xl border border-blue-300/10 bg-blue-300/[0.06] px-4 py-3 text-center text-[10px] leading-5 text-blue-100/70">
              Les abonnements et paiements Pro ne sont pas encore disponibles.
            </div>
          </article>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-center sm:p-7">
          <p className="text-sm font-semibold text-white">Vous avez une question ?</p>
          <p className="mt-2 text-xs text-slate-400">Explorez Boostly gratuitement et découvrez comment votre page peut évoluer.</p>
          <Link to="/signup" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-300 transition hover:text-white">Créer ma page <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </main>
    <footer className="border-t border-white/[0.07] px-5 py-7 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-[10px] text-slate-500 sm:flex-row">
        <span>© {new Date().getFullYear()} Boostly. Fait pour les créateurs.</span>
        <Link to="/" className="transition hover:text-white">Retour à l’accueil</Link>
      </div>
    </footer>
  </div>
);
