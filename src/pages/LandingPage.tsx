import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-wider flex items-center gap-2">
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-black text-sm">B</span> BOOSTLY
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/pricing" className="text-sm font-medium text-slate-400 hover:text-white transition">
              Tarification
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Connexion
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Créer ma page
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Plateforme SaaS d'optimisation de liens
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Your audience. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            One powerful page.
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Créez une page unique pour partager vos liens, présenter votre contenu et comprendre ce que votre audience consulte réellement grâce à des statistiques réelles.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium text-sm transition shadow-lg shadow-blue-600/20"
          >
            Créer ma page gratuitement
          </Link>
          <a
            href="#features"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-6 py-3 rounded-lg font-medium text-sm transition"
          >
            Voir comment ça marche
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-slate-800/80 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold">Conçu pour les créateurs exigeants</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Centralisez vos contenus et obtenez une vision claire de l'engagement de votre communauté.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-lg">
                🔗
              </div>
              <h3 className="text-lg font-bold text-white">Tout au même endroit</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Centralisez vos réseaux sociaux, vos vidéos, articles et boutiques sur une seule page ultra-rapide.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-lg">
                📈
              </div>
              <h3 className="text-lg font-bold text-white">Comprenez votre audience</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Suivez le nombre exact de vues, le taux de clic (CTR) et les liens les plus performants en temps réel.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-lg">
                🤖
              </div>
              <h3 className="text-lg font-bold text-white">Optimisez votre page</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Profitez de Boost AI pour recevoir des suggestions personnalisées basées exclusivement sur vos vraies données.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Boostly. Tous droits réservés.
      </footer>
    </div>
  );
};