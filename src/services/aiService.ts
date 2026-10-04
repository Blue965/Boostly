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
  const { data, error } = await supabase.functions.invoke<AnalyzeResponse>('boost-ai-analyze');
  if (error) throw error;
  if (!data || !Array.isArray(data.recommendations)) {
    throw new Error("La réponse du service d'analyse est invalide.");
  }

  return data;
}