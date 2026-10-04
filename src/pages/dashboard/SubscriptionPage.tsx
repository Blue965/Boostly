import React from 'react';
import { useUserPage } from '../../hooks/useUserPage';

export const SubscriptionPage: React.FC = () => {
  const { subscription, loading } = useUserPage();

  if (loading) return <div className="p-6 text-slate-400">Chargement...</div>;

  const isPro = subscription?.plan === 'pro' && subscription?.status === 'active';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Abonnement</h1>
        <p className="text-sm text-slate-400">Gérez votre plan Boostly et vos fonctionnalités.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Plan actuel</span>
            <h2 className="text-xl font-bold text-white uppercase">{subscription?.plan || 'Free'}</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isPro ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
            {subscription?.status === 'active' ? 'Actif' : 'Inactif'}
          </span>
        </div>

        {!isPro && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <p className="text-xs text-slate-400">
              Passez à Boostly PRO pour débloquer les liens illimités, masquer le branding Boostly et accéder aux analytics 90 jours.
            </p>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
              L'intégration Stripe des paiements en direct est en cours de déploiement sécurisé.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};