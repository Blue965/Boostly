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
  updates: Partial<Pick<PageConfig, 'title' | 'theme' | 'background_color' | 'background_image_url' | 'accent_color' | 'button_style' | 'font_family' | 'hide_branding'>>,
): Promise<void> {
  const { error } = await supabase.from('pages').update(updates).eq('id', pageId);
  if (error) throw error;
}

const MEDIA_BUCKET = 'boostly-media';
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface UploadedUserImage {
  path: string;
  publicUrl: string;
}

export async function uploadUserImage(
  userId: string,
  kind: 'avatar' | 'background',
  file: File,
): Promise<UploadedUserImage> {
  const extension = IMAGE_EXTENSIONS[file.type];
  if (!extension) throw new Error('Choisissez une image PNG, JPG ou WebP.');
  if (file.size > MAX_IMAGE_SIZE) throw new Error("L'image doit faire 8 Mo maximum.");
  if (file.size === 0) throw new Error("Le fichier image est vide.");

  const path = `${userId}/${kind}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function removeUserImage(path: string, userId: string): Promise<void> {
  if (path.split('/')[0] !== userId) {
    throw new Error("Impossible de supprimer une image qui n'appartient pas à ce compte.");
  }
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw error;
}

export function getUserImagePath(publicUrl: string | null, userId: string): string | null {
  if (!publicUrl) return null;
  try {
    const url = new URL(publicUrl);
    const bucketPrefix = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
    const prefixIndex = url.pathname.indexOf(bucketPrefix);
    if (prefixIndex < 0) return null;
    const path = decodeURIComponent(url.pathname.slice(prefixIndex + bucketPrefix.length));
    return path.split('/')[0] === userId ? path : null;
  } catch {
    return null;
  }
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