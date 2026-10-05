import React, { useState } from 'react';
import { useUserPage } from '../../hooks/useUserPage';
import { LivePreview } from '../../components/preview/LivePreview';
import { supabase } from '../../lib/supabase';
import { createLink, deleteLink, updateLink } from '../../services/pageService';
import { LinkItem } from '../../types/database.types';

type ScheduleDraft = { starts_at: string; ends_at: string };

const inputClassName = 'w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white';

function toLocalDateTime(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromLocalDateTime(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

function getLinkStatus(link: LinkItem): string {
  if (!link.is_active) return 'Masqué';
  const now = Date.now();
  if (link.starts_at && new Date(link.starts_at).getTime() > now) return `Programmé · ${new Date(link.starts_at).toLocaleString()}`;
  if (link.ends_at && new Date(link.ends_at).getTime() <= now) return 'Expiré';
  if (link.ends_at) return `En ligne jusqu’au ${new Date(link.ends_at).toLocaleString()}`;
  return 'En ligne';
}

export const PageEditor: React.FC = () => {
  const { profile, page, links, setLinks, setProfile } = useUserPage();
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newStartsAt, setNewStartsAt] = useState('');
  const [newEndsAt, setNewEndsAt] = useState('');
  const [scheduleDrafts, setScheduleDrafts] = useState<Record<string, ScheduleDraft>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleAddLink = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!page || !newTitle.trim() || !newUrl.trim()) return;
    const startsAt = fromLocalDateTime(newStartsAt);
    const endsAt = fromLocalDateTime(newEndsAt);
    if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
      setError('La date de fin doit être postérieure à la date de début.');
      return;
    }

    setLoading(true);
    setError('');
    setNotice('');
    try {
      const link = await createLink(page.id, {
        title: newTitle.trim(),
        url: newUrl.trim(),
        position: links.length,
        starts_at: startsAt,
        ends_at: endsAt,
      });
      setLinks([...links, link]);
      setNewTitle('');
      setNewUrl('');
      setNewStartsAt('');
      setNewEndsAt('');
      setNotice('Lien ajouté.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible d’ajouter ce lien.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (link: LinkItem) => {
    setError('');
    try {
      await updateLink(link.id, { is_active: !link.is_active });
      setLinks(links.map((item) => item.id === link.id ? { ...item, is_active: !link.is_active } : item));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible de modifier ce lien.');
    }
  };

  const handleSaveSchedule = async (link: LinkItem) => {
    const draft = scheduleDrafts[link.id] ?? {
      starts_at: toLocalDateTime(link.starts_at),
      ends_at: toLocalDateTime(link.ends_at),
    };
    const startsAt = fromLocalDateTime(draft.starts_at);
    const endsAt = fromLocalDateTime(draft.ends_at);
    if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
      setError('La date de fin doit être postérieure à la date de début.');
      return;
    }

    setError('');
    setNotice('');
    try {
      await updateLink(link.id, { starts_at: startsAt, ends_at: endsAt });
      setLinks(links.map((item) => item.id === link.id ? { ...item, starts_at: startsAt, ends_at: endsAt } : item));
      setScheduleDrafts((current) => {
        const next = { ...current };
        delete next[link.id];
        return next;
      });
      setNotice('Programmation enregistrée.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible d’enregistrer la programmation.');
    }
  };

  const handleDeleteLink = async (id: string) => {
    setError('');
    try {
      await deleteLink(id);
      setLinks(links.filter((link) => link.id !== id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible de supprimer ce lien.');
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:flex-row">
      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Éditeur de page</h1>
          <p className="mt-1 text-sm text-slate-400">Gère tes liens et choisis quand ils apparaissent sur ta page.</p>
        </div>

        {error && <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        {notice && <div role="status" className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</div>}

        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-300">Informations du profil</h2>
          <label className="block space-y-1 text-xs text-slate-400">
            Nom affiché
            <input
              type="text"
              value={profile?.display_name || ''}
              onChange={(event) => setProfile(profile ? { ...profile, display_name: event.target.value } : null)}
              onBlur={async () => {
                if (!profile) return;
                const { error: updateError } = await supabase.from('profiles').update({ display_name: profile.display_name }).eq('id', profile.id);
                if (updateError) setError(updateError.message);
              }}
              className={inputClassName}
            />
          </label>
          <label className="block space-y-1 text-xs text-slate-400">
            Bio
            <textarea
              value={profile?.bio || ''}
              onChange={(event) => setProfile(profile ? { ...profile, bio: event.target.value } : null)}
              onBlur={async () => {
                if (!profile) return;
                const { error: updateError } = await supabase.from('profiles').update({ bio: profile.bio }).eq('id', profile.id);
                if (updateError) setError(updateError.message);
              }}
              className={`${inputClassName} h-20`}
            />
          </label>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-300">Ajouter un lien</h2>
          <form onSubmit={(event) => void handleAddLink(event)} className="space-y-3">
            <input required type="text" placeholder="Titre du lien (ex. Mon Portfolio)" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} className={inputClassName} />
            <input required type="url" placeholder="URL (https://...)" value={newUrl} onChange={(event) => setNewUrl(event.target.value)} className={inputClassName} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-slate-400">Publier à partir de
                <input type="datetime-local" value={newStartsAt} onChange={(event) => setNewStartsAt(event.target.value)} className={inputClassName} />
              </label>
              <label className="space-y-1 text-xs text-slate-400">Retirer à partir de
                <input type="datetime-local" value={newEndsAt} onChange={(event) => setNewEndsAt(event.target.value)} className={inputClassName} />
              </label>
            </div>
            <p className="text-xs text-slate-500">Laisse les dates vides pour afficher le lien sans programmation.</p>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60">
              {loading ? 'Ajout…' : '+ Ajouter le lien'}
            </button>
          </form>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">Vos liens</h2>
          {links.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-500">Vous n’avez encore aucun lien.</div>
          ) : links.map((link) => {
            const draft = scheduleDrafts[link.id] ?? {
              starts_at: toLocalDateTime(link.starts_at),
              ends_at: toLocalDateTime(link.ends_at),
            };
            const hasChanges = draft.starts_at !== toLocalDateTime(link.starts_at) || draft.ends_at !== toLocalDateTime(link.ends_at);
            return (
              <article key={link.id} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{link.title}</p>
                    <p className="break-all text-xs text-slate-500">{link.url}</p>
                    <p className="mt-1 text-xs text-blue-300">{getLinkStatus(link)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => void handleToggleActive(link)} className={`rounded px-2 py-1 text-xs ${link.is_active ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                      {link.is_active ? 'Actif' : 'Masqué'}
                    </button>
                    <button type="button" onClick={() => void handleDeleteLink(link.id)} className="text-xs text-red-400 hover:underline">Supprimer</button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-xs text-slate-400">Publier à partir de
                    <input type="datetime-local" value={draft.starts_at} onChange={(event) => setScheduleDrafts((current) => ({ ...current, [link.id]: { ...draft, starts_at: event.target.value } }))} className={inputClassName} />
                  </label>
                  <label className="space-y-1 text-xs text-slate-400">Retirer à partir de
                    <input type="datetime-local" value={draft.ends_at} onChange={(event) => setScheduleDrafts((current) => ({ ...current, [link.id]: { ...draft, ends_at: event.target.value } }))} className={inputClassName} />
                  </label>
                </div>
                <button type="button" disabled={!hasChanges} onClick={() => void handleSaveSchedule(link)} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40">
                  Enregistrer la programmation
                </button>
              </article>
            );
          })}
        </section>
      </div>

      <div className="hidden lg:block">
        <LivePreview profile={profile} page={page} links={links} />
      </div>
    </div>
  );
};
