import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { supabase } from '../../lib/supabase';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.16),transparent_55%),#070b16] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#0d1423] border border-white/[0.09] rounded-2xl p-7 shadow-2xl shadow-black/30 sm:p-9 space-y-6">
        <Link to="/" aria-label="Boostly accueil" className="mx-auto flex w-fit">
          <BrandLogo size="small" wordmarkClassName="text-slate-300" />
        </Link>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Votre page commence ici.</h1>
          <p className="text-sm text-slate-400">Rejoignez la plateforme et créez votre page</p>
        </div>

        {error && <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#080d18] border border-white/[0.09] rounded-xl px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#080d18] border border-white/[0.09] rounded-xl px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/10"
            />
          </div>
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 shadow-lg shadow-blue-500/15"
          >
            {loading ? 'Création du compte...' : "S'inscrire"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-slate-600">
          <span className="h-px flex-1 bg-slate-800" />
          <span>ou</span>
          <span className="h-px flex-1 bg-slate-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-50"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.64 5.92c4.46-4.11 7.13-10.16 7.13-17.57Z" />
            <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.78l-7.64-5.92c-2.13 1.43-4.86 2.28-8.27 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
          </svg>
          {googleLoading ? 'Redirection vers Google...' : 'Continuer avec Google'}
        </button>

        <div className="text-center text-xs text-slate-400">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};