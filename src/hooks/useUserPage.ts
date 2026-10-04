import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, PageConfig, LinkItem, Subscription } from '../types/database.types';
import { useAuth } from '../context/AuthContext';

export function useUserPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<PageConfig | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    if (!user) { setLoading(false); return; }

    const [profRes, pageRes, subRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('pages').select('*').eq('user_id', user.id).single(),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
    ]);

    if (profRes.data) setProfile(profRes.data);
    if (pageRes.data) {
      setPage(pageRes.data);
      const { data: linksData } = await supabase
        .from('links')
        .select('*')
        .eq('page_id', pageRes.data.id)
        .order('position', { ascending: true });
      setLinks(linksData || []);
    }
    if (subRes.data) setSubscription(subRes.data);

    setLoading(false);
  };

  useEffect(() => { fetchUserData(); }, [user]);

  return { profile, page, links, subscription, loading, refresh: fetchUserData, setLinks, setPage, setProfile };
}