import React, { useState } from 'react';
import { useUserPage } from '../../hooks/useUserPage';
import { LivePreview } from '../../components/preview/LivePreview';
import { supabase } from '../../lib/supabase';

export const PageEditor: React.FC = () => {
  const { profile, page, links, setLinks, setProfile, refresh } = useUserPage();
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page || !newTitle || !newUrl) return;

    setLoading(true);
    const position = links.length;
    const { data, error } = await supabase.from('links').insert({
      page_id: page.id,
      title: newTitle,
      url: newUrl,
      position,
      is_active: true
    }).select().single();

    if (data && !error) {
      setLinks([...links, data]);
      setNewTitle('');
      setNewUrl('');
    }
    setLoading(false);
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await supabase.from('links').update({ is_active: !current }).eq('id', id);
    setLinks(links.map(l => l.id === id ? { ...l, is_active: !current } : l));
  };

  const handleDeleteLink = async (id: string) => {
    await supabase.from('links').delete().eq('id', id);
    setLinks(links.filter(l => l.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <h1 className="text-2xl font-bold text-white">Éditeur de Page</h1>

        {/* Profile Info Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Informations du Profil</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nom affiché</label>
              <input
                type="text"
                value={profile?.display_name || ''}
                onChange={(e) => setProfile(profile ? { ...profile, display_name: e.target.value } : null)}
                onBlur={async () => {
                  if (profile) await supabase.from('profiles').update({ display_name: profile.display_name }).eq('id', profile.id);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Bio</label>
              <textarea
                value={profile?.bio || ''}
                onChange={(e) => setProfile(profile ? { ...profile, bio: e.target.value } : null)}
                onBlur={async () => {
                  if (profile) await supabase.from('profiles').update({ bio: profile.bio }).eq('id', profile.id);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white h-20"
              />
            </div>
          </div>
        </div>

        {/* Add Link Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Ajouter un nouveau lien</h2>
          <form onSubmit={handleAddLink} className="space-y-3">
            <input
              type="text"
              placeholder="Titre du lien (ex: Mon Portfolio)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
            />
            <input
              type="url"
              placeholder="URL (https://...)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition"
            >
              + Ajouter le lien
            </button>
          </form>
        </div>

        {/* Existing Links List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">Vos liens</h2>
          {links.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-sm text-slate-500">
              Vous n'avez encore aucun lien.
            </div>
          ) : (
            links.map((link) => (
              <div key={link.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{link.title}</p>
                  <p className="text-xs text-slate-500">{link.url}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleActive(link.id, link.is_active)}
                    className={`px-2 py-1 text-xs rounded ${link.is_active ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}
                  >
                    {link.is_active ? 'Actif' : 'Masqué'}
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <LivePreview profile={profile} page={page} links={links} />
      </div>
    </div>
  );
};