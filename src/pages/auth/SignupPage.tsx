import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { supabase } from '../../lib/supabase';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 shadow-lg shadow-blue-500/15"
          >
            {loading ? 'Création du compte...' : "S'inscrire"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};