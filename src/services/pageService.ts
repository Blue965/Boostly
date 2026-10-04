import { supabase } from '../lib/supabase';
import { LinkItem, PageConfig, Profile, Subscription } from '../types/database.types';

export interface UserPageData {
  profile: Profile | null;
  page: PageConfig | null;
  links: LinkItem[];
  subscription: Subscription | null;
}

export async function getUserPageData(userId: string): Promise<UserPageData> {
  const [profileResult, pageResult, subscriptionResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('pages').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('subscriptions').select('*').eq('user_id', userId).maybeSingle(),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (pageResult.error) throw pageResult.error;
  if (subscriptionResult.error) throw subscriptionResult.error;

  const profile = profileResult.data;
  let page = pageResult.data;

  if (profile && !page) {
    const { data, error } = await supabase
      .from('pages')
      .insert({ user_id: userId, title: profile.display_name || profile.username })
      .select()
      .single();

    if (error) throw error;
    page = data;
  }

  let links: LinkItem[] = [];
  if (page) {
    const linksResult = await supabase
      .from('links')
      .select('*')
      .eq('page_id', page.id)
      .order('position', { ascending: true });

    if (linksResult.error) throw linksResult.error;
    links = linksResult.data ?? [];
  }

  return {
    profile,
    page,
    links,
    subscription: subscriptionResult.data,
  };
}

export async function updateProfile(
  profileId: string,
  updates: Pick<Profile, 'display_name' | 'bio' | 'avatar_url'>,
): Promise<void> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', profileId);
  if (error) throw error;
}

export async function updatePage(
  pageId: string,
  updates: Partial<Pick<PageConfig, 'title' | 'theme' | 'background_color' | 'accent_color' | 'button_style' | 'font_family' | 'hide_branding'>>,
): Promise<void> {
  const { error } = await supabase.from('pages').update(updates).eq('id', pageId);
  if (error) throw error;
}

export async function createLink(
  pageId: string,
  link: Pick<LinkItem, 'title' | 'url'> & Partial<Pick<LinkItem, 'icon' | 'image_url' | 'position'>>,
): Promise<LinkItem> {
  const { data, error } = await supabase
    .from('links')
    .insert({ ...link, page_id: pageId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLink(
  linkId: string,
  updates: Partial<Pick<LinkItem, 'title' | 'url' | 'icon' | 'image_url' | 'position' | 'is_active'>>,
): Promise<void> {
  const { error } = await supabase.from('links').update(updates).eq('id', linkId);
  if (error) throw error;
}

export async function deleteLink(linkId: string): Promise<void> {
  const { error } = await supabase.from('links').delete().eq('id', linkId);
  if (error) throw error;
}