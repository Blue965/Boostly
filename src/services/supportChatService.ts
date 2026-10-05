import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface SupportMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SupportChatResponse {
  reply: string;
}

export async function sendSupportMessage(messages: SupportMessage[]): Promise<string> {
  const { data, error } = await supabase.functions.invoke<SupportChatResponse>('boostly-support-chat', {
    body: { messages },
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
    throw new Error(`Le support Boostly a renvoyé une erreur HTTP ${response.status}.`);
  }
  if (error) throw error;
  if (!data || typeof data.reply !== 'string' || !data.reply.trim()) {
    throw new Error('Le support Boostly a renvoyé une réponse invalide.');
  }
  return data.reply;
}
