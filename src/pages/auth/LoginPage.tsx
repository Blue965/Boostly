import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);
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

  const handleDiscordLogin = async () => {
    setDiscordLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setDiscordLoading(false);
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
            disabled={loading || discordLoading}
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
          onClick={handleDiscordLogin}
          disabled={loading || discordLoading}
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M19.73 5.14a19.2 19.2 0 0 0-4.72-1.47.07.07 0 0 0-.08.04c-.2.36-.42.84-.58 1.22a17.7 17.7 0 0 0-5.3 0c-.16-.39-.38-.86-.59-1.22a.08.08 0 0 0-.08-.04 19.15 19.15 0 0 0-4.72 1.47.07.07 0 0 0-.03.03C.62 9.56-.2 13.85.2 18.1c0 .02.01.04.03.05a19.36 19.36 0 0 0 5.8 2.93.08.08 0 0 0 .09-.03c.45-.62.85-1.28 1.2-1.98a.08.08 0 0 0-.04-.1 12.74 12.74 0 0 1-1.81-.86.08.08 0 0 1-.01-.13l.36-.28a.07.07 0 0 1 .08-.01c3.8 1.73 7.92 1.73 11.68 0a.07.07 0 0 1 .08.01l.36.28a.08.08 0 0 1-.01.13c-.58.34-1.19.63-1.82.86a.08.08 0 0 0-.04.1c.36.7.76 1.36 1.2 1.98a.08.08 0 0 0 .09.03 19.3 19.3 0 0 0 5.81-2.93.08.08 0 0 0 .03-.05c.48-4.91-.8-9.16-3.42-12.93a.06.06 0 0 0-.03-.03ZM8.02 15.65c-1.14 0-2.08-1.05-2.08-2.34s.92-2.34 2.08-2.34c1.17 0 2.1 1.06 2.08 2.34 0 1.29-.92 2.34-2.08 2.34Zm7.96 0c-1.14 0-2.08-1.05-2.08-2.34s.92-2.34 2.08-2.34c1.17 0 2.1 1.06 2.08 2.34 0 1.29-.91 2.34-2.08 2.34Z" />
          </svg>
          {discordLoading ? 'Redirection vers Discord...' : 'Continuer avec Discord'}
        </button>

        <div className="text-center text-xs text-slate-400">
          Pas encore de compte ?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
};