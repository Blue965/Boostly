import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile, PageConfig, LinkItem } from '../types/database.types';
import { sanitizeUrl } from '../lib/utils';
import { ProfileCard } from '../components/preview/ProfileCard';

export const PublicPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<PageConfig | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!username) return;
      setLoading(true);
      setLoadError('');
      const { data: prof } = await supabase.from('profiles').select('*').eq('username', username.toLowerCase()).single();
      if (!prof) { setLoading(false); return; }

      setProfile(prof);
      const { data: pageConfig } = await supabase.from('pages').select('*').eq('user_id', prof.id).single();
      if (pageConfig) {
        setPage(pageConfig);
        const now = new Date().toISOString();
        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('page_id', pageConfig.id)
          .eq('is_active', true)
          .or(`starts_at.is.null,starts_at.lte.${now}`)
          .or(`ends_at.is.null,ends_at.gt.${now}`)
          .order('position', { ascending: true });
        if (linksError) {
          setLoadError(linksError.message);
          setLoading(false);
          return;
        }
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
  if (loadError) return <div role="alert" className="min-h-screen bg-slate-950 flex items-center justify-center px-6 text-center text-sm text-red-300">Impossible de charger les liens de cette page : {loadError}</div>;
  if (!profile || !page) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Page introuvable.</div>;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-8 p-5 bg-cover bg-center bg-fixed sm:p-8"
      style={{
        backgroundColor: page.background_color,
        backgroundImage: page.background_image_url
          ? `linear-gradient(rgba(2, 6, 23, 0.42), rgba(2, 6, 23, 0.62)), url("${page.background_image_url}")`
          : undefined,
        fontFamily: page.font_family,
      }}
    >
      <ProfileCard
        profile={profile}
        page={page}
        links={links}
        onLinkClick={(link, event) => void handleLinkClick(link, event)}
      />
    </main>
  );
};