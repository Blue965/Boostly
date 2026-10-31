import { useCallback, useEffect, useRef, useState } from 'react';
import { Profile, PageConfig, LinkItem, Subscription } from '../types/database.types';
import { useAuth } from '../context/AuthContext';
import { getUserPageData } from '../services/pageService';

export function useUserPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<PageConfig | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const fetchUserData = useCallback(async () => {
    const currentRequestId = ++requestId.current;

    if (authLoading) {
      setLoading(true);
      return;
    }

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
      const emailUsername = user.primaryEmailAddress?.emailAddress.split('@')[0];
      const username = user.username || emailUsername || `user-${user.id.slice(-8)}`;
      const displayName = user.fullName || user.firstName || username;
      const data = await getUserPageData(user.id, {
        username: username.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 32),
        displayName,
        avatarUrl: user.imageUrl || null,
      });
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
  }, [authLoading, user]);

  useEffect(() => {
    void fetchUserData();
    return () => {
      requestId.current += 1;
    };
  }, [fetchUserData]);

  return { profile, page, links, subscription, loading, error, refresh: fetchUserData, setLinks, setPage, setProfile };
}
