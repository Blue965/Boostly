import React, { useState } from 'react';
import { analyzePagePerformance, AIRecommendation } from '../../services/aiService';

export const BoostAIPage: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[] | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const result = await analyzePagePerformance();
      setRecommendations(result.recommendations);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d'analyser votre page pour le moment.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Boost AI</h1>
        <p className="text-sm text-slate-400">Assistant d'analyse basé sur les statistiques réelles de votre page.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Analyser les performances</h2>
          <p className="text-xs text-slate-400">
            L'IA va analyser votre nombre de vues, vos clics et la disposition de vos liens afin de vous proposer des ajustements concrets.
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {analyzing ? 'Analyse en cours...' : 'Analyser ma page'}
        </button>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
          {error}
        </div>
      )}

      {recommendations && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Recommandations</h2>
          {recommendations.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-sm text-slate-400">
              Continuez à partager votre page pour obtenir suffisamment de données réelles pour une analyse.
            </div>
          ) : (
            recommendations.map((rec, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 uppercase">
                    {rec.type}
                  </span>
                  <h3 className="text-sm font-bold text-white">{rec.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};