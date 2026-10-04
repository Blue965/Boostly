import React from 'react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-wider flex items-center gap-2">
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-black text-sm">B</span> BOOSTLY
          </Link>
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition">
            Connexion
          </Link>
        </div>
      </header>

      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold">Tarifs simples et transparents</h1>
          <p className="text-sm text-slate-400">Choisissez le plan adapté à vos besoins. Aucun frais caché.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
          {/* Plan FREE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">FREE</h2>
              <div className="text-3xl font-extrabold text-white">0 $ <span className="text-xs text-slate-400 font-normal">/ mois</span></div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ 1 page publique</li>
                <li className="flex items-center gap-2">✓ Jusqu'à 10 liens</li>
                <li className="flex items-center gap-2">✓ Personnalisation basique</li>
                <li className="flex items-center gap-2">✓ Analytics 7 derniers jours</li>
                <li className="flex items-center gap-2">✓ Branding Boostly</li>
              </ul>
            </div>
            <Link
              to="/signup"
              className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg text-xs transition"
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Plan PRO */}
          <div className="bg-slate-900 border-2 border-blue-600 rounded-2xl p-8 flex flex-col justify-between space-y-6 relative shadow-xl shadow-blue-600/10">
            <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Recommandé
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">PRO</h2>
              <div className="text-3xl font-extrabold text-white">4,99 $ <span className="text-xs text-slate-400 font-normal">/ mois</span></div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Liens illimités</li>
                <li className="flex items-center gap-2">✓ Personnalisation avancée</li>
                <li className="flex items-center gap-2">✓ Analytics 90 jours</li>
                <li className="flex items-center gap-2">✓ Analyse Boost AI complète</li>
                <li className="flex items-center gap-2">✓ Suppression du branding Boostly</li>
              </ul>
            </div>
            <Link
              to="/signup"
              className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-xs transition"
            >
              Passer au plan PRO
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};