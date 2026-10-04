import { useCallback, useEffect, useRef, useState } from 'react';
import { Profile, PageConfig, LinkItem, Subscription } from '../types/database.types';
import { useAuth } from '../context/AuthContext';
import { getUserPageData } from '../services/pageService';

export function useUserPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<PageConfig | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const fetchUserData = useCallback(async () => {
    const currentRequestId = ++requestId.current;

    if (!user) {
      setProfile(null);
      setPage(null);
      setLinks([]);
      setSubscription(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserPageData(user.id);
      if (currentRequestId !== requestId.current) return;

      setProfile(data.profile);
      setPage(data.page);
      setLinks(data.links);
      setSubscription(data.subscription);

      if (!data.profile) {
        setError('Le profil Boostly est introuvable. Vérifie que la migration Supabase a été exécutée après la configuration du projet.');
      }
    } catch (caught) {
      if (currentRequestId !== requestId.current) return;
      setError(caught instanceof Error ? caught.message : 'Impossible de charger les données du compte.');
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchUserData();
    return () => {
      requestId.current += 1;
    };
  }, [fetchUserData]);

  return { profile, page, links, subscription, loading, error, refresh: fetchUserData, setLinks, setPage, setProfile };
}