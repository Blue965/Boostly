import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    window.setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Nouveau mot de passe</h1>
          <p className="text-sm text-slate-400">Choisissez un mot de passe sécurisé pour votre compte.</p>
        </div>

        {error && <p role="alert" className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">{error}</p>}
        {success ? (
          <p role="status" className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-lg">
            Mot de passe modifié. Redirection vers votre tableau de bord...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">Nouveau mot de passe</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-xs font-medium text-slate-300 mb-1">Confirmer le mot de passe</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Modifier le mot de passe'}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-400">
          <Link to="/login" className="text-blue-400 hover:underline">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
};