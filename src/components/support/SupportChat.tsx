import React, { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendSupportMessage, SupportMessage } from '../../services/supportChatService';

const greeting: SupportMessage = {
  role: 'assistant',
  content: 'Salut ! Je suis Boostly Support. Comment puis-je t’aider avec ta page, tes liens ou ses réglages ?',
};

export const SupportChat: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<SupportMessage[]>([greeting]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [open, messages, sending]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (authLoading || !user) return null;

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || sending) return;
    if (content.length > 1200) {
      setError('Ton message est trop long (maximum 1 200 caractères).');
      return;
    }

    const nextMessages: SupportMessage[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);
    setError('');

    try {
      const reply = await sendSupportMessage(nextMessages.slice(-11));
      setMessages((current) => [...current, { role: 'assistant', content: reply }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible de joindre le support pour le moment.');
    } finally {
      setSending(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-[70] md:bottom-6 md:right-6">
      {open && (
        <section
          ref={panelRef}
          role="dialog"
          aria-label="Chat du support Boostly"
          aria-modal="false"
          className="mb-3 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/50"
        >
          <header className="flex items-center gap-3 border-b border-white/[0.08] bg-gradient-to-r from-blue-600/20 to-cyan-500/10 px-4 py-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 13v-1a8 8 0 0 1 16 0v1M4 13a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Zm-2 2v1a3 3 0 0 1-3 3h-2" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-white">Boostly Support</h2>
              <p className="mt-0.5 text-[11px] text-slate-400">Assistant IA · pose-moi une question</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le chat"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  message.role === 'user'
                    ? 'rounded-br-md bg-blue-500 text-white'
                    : 'rounded-bl-md border border-white/[0.08] bg-white/[0.05] text-slate-200'
                }`}>
                  {message.content}
                </p>
              </div>
            ))}
            {sending && (
              <p role="status" className="text-xs text-slate-500">Boostly Support rédige une réponse…</p>
            )}
            {error && (
              <div role="alert" className="rounded-xl border border-red-400/15 bg-red-400/[0.07] px-3 py-2 text-xs text-red-200">
                {error}
                <button type="button" onClick={() => setError('')} className="ml-2 font-semibold underline">Fermer</button>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={(event) => void handleSend(event)} className="border-t border-white/[0.08] p-3">
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-black/20 p-2 focus-within:border-blue-400/50">
              <label className="sr-only" htmlFor="support-message">Ton message</label>
              <textarea
                id="support-message"
                rows={1}
                maxLength={1200}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Écris ta question…"
                className="max-h-28 min-h-9 flex-1 resize-y bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Envoyer le message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 14-7-4 14-3-6-7-1Zm6 1 8-8" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-600">Ne partage pas de mot de passe ou de clé privée.</p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Fermer le support Boostly' : 'Ouvrir le support Boostly'}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-300/25 bg-blue-500 text-white shadow-xl shadow-blue-500/30 transition hover:scale-105 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-[#070b16]"
      >
        {open ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 13v-1a8 8 0 0 1 16 0v1M4 13a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Zm-2 2v1a3 3 0 0 1-3 3h-2" />
          </svg>
        )}
      </button>
    </div>
  );
};
