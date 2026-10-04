import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error: requestError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (requestError) setError(requestError.message);
    else setMessage('Si cette adresse est associée à un compte, un lien de réinitialisation vient de lui être envoyé.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Mot de passe oublié</h1>
          <p className="text-sm text-slate-400">Recevez un lien pour choisir un nouveau mot de passe.</p>
        </div>

        {error && <p role="alert" className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">{error}</p>}
        {message && <p role="status" className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-lg">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          <Link to="/login" className="text-blue-400 hover:underline">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
};