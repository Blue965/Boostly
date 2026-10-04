import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Connexion à Boostly</h1>
          <p className="text-sm text-slate-400">Accédez au tableau de bord de votre page</p>
        </div>

        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-xs text-blue-400 hover:underline">Mot de passe oublié ?</Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-slate-800" />
          <span>ou</span>
          <span className="h-px flex-1 bg-slate-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full bg-white hover:bg-slate-100 text-slate-900 font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
        >
          {googleLoading ? 'Redirection vers Google...' : 'Continuer avec Google'}
        </button>

        <div className="text-center text-xs text-slate-400">
          Pas encore de compte ?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
};