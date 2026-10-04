import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile, PageConfig, LinkItem } from '../types/database.types';
import { sanitizeUrl } from '../lib/utils';

export const PublicPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<PageConfig | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!username) return;
      const { data: prof } = await supabase.from('profiles').select('*').eq('username', username.toLowerCase()).single();
      if (!prof) { setLoading(false); return; }

      setProfile(prof);
      const { data: pageConfig } = await supabase.from('pages').select('*').eq('user_id', prof.id).single();
      if (pageConfig) {
        setPage(pageConfig);
        const { data: linksData } = await supabase.from('links').select('*').eq('page_id', pageConfig.id).eq('is_active', true).order('position', { ascending: true });
        setLinks(linksData || []);

        // Log page view
        await supabase.from('page_views').insert({ page_id: pageConfig.id, referrer: document.referrer || 'direct' });
      }
      setLoading(false);
    };
    load();
  }, [username]);

  const handleLinkClick = async (link: LinkItem, e: React.MouseEvent) => {
    e.preventDefault();
    if (page) {
      supabase.from('link_clicks').insert({ page_id: page.id, link_id: link.id, referrer: document.referrer || 'direct' });
    }
    window.open(sanitizeUrl(link.url), '_blank', 'noopener,noreferrer');
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Chargement...</div>;
  if (!profile || !page) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Page introuvable.</div>;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-6 bg-cover bg-center bg-fixed"
      style={{
        backgroundColor: page.background_color,
        backgroundImage: page.background_image_url
          ? `linear-gradient(rgba(2, 6, 23, 0.42), rgba(2, 6, 23, 0.62)), url("${page.background_image_url}")`
          : undefined,
        fontFamily: page.font_family,
      }}
    >
      <div className="w-full max-w-md flex flex-col items-center space-y-6 pt-8">
        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-white/20 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
          {profile.avatar_url ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : (profile.display_name || profile.username).charAt(0).toUpperCase()}
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-white">{page.title || profile.display_name || `@${profile.username}`}</h1>
          {profile.bio && <p className="text-sm text-slate-300 max-w-sm">{profile.bio}</p>}
        </div>

        <div className="w-full space-y-3 pt-4">
          {links.length === 0 ? (
            <div className="text-center text-sm text-slate-500 py-6">Aucun lien disponible.</div>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                onClick={(e) => handleLinkClick(link, e)}
                className={`w-full py-3 px-5 block text-center font-medium transition shadow-sm hover:scale-[1.01] ${
                  page.button_style === 'pill' ? 'rounded-full' :
                  page.button_style === 'square' ? 'rounded-none' :
                  page.button_style === 'outline' ? 'border border-blue-500 bg-transparent text-white' : 'rounded-xl'
                }`}
                style={{
                  backgroundColor: page.button_style === 'outline' ? 'transparent' : page.accent_color,
                  color: '#ffffff'
                }}
              >
                {link.title}
              </a>
            ))
          )}
        </div>
      </div>

      {!page.hide_branding && (
        <div className="pt-12 pb-4 text-xs text-slate-500 tracking-wider">
          Powered by <span className="font-bold text-slate-300">BOOSTLY</span>
        </div>
      )}
    </div>
  );
};