import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AIRecommendation {
  type: string;
  title: string;
  message: string;
}

interface AnalyzeResponse {
  recommendations: AIRecommendation[];
  analyzed_at: string;
}

export async function analyzePagePerformance(): Promise<AnalyzeResponse> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) throw new Error('Ta session a expiré. Reconnecte-toi avant de lancer une analyse.');

  const { data, error } = await supabase.functions.invoke<AnalyzeResponse>('boost-ai-analyze', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (error instanceof FunctionsHttpError && error.context instanceof Response) {
    const response = error.context;
    let body: unknown;
    try {
      body = await response.clone().json();
    } catch {
      body = null;
    }

    if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
      throw new Error(body.error);
    }
    throw new Error(`La fonction Boost AI a renvoyé une erreur HTTP ${response.status}. Consulte les logs Supabase pour le détail.`);
  }
  if (error) throw error;
  if (!data || !Array.isArray(data.recommendations)) {
    throw new Error("La réponse du service d'analyse est invalide.");
  }

  return data;
}