export interface MusicEmbed {
  provider: 'Spotify' | 'YouTube' | 'SoundCloud' | 'Apple Music';
  src: string;
  aspectRatio: 'video' | 'audio';
}

function getVideoId(url: URL): string | null {
  if (url.hostname === 'youtu.be' || url.hostname === 'www.youtu.be') {
    return url.pathname.split('/').filter(Boolean)[0] ?? null;
  }
  if (url.hostname === 'youtube.com' || url.hostname === 'www.youtube.com' || url.hostname === 'music.youtube.com') {
    if (url.pathname === '/watch') return url.searchParams.get('v');
    const parts = url.pathname.split('/').filter(Boolean);
    if (['embed', 'shorts', 'live'].includes(parts[0] ?? '')) return parts[1] ?? null;
  }
  return null;
}

export function getMusicEmbed(value: string | null): MusicEmbed | null {
  if (!value?.trim()) return null;

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;

  const hostname = url.hostname.toLowerCase();

  if (hostname === 'open.spotify.com' || hostname === 'www.open.spotify.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    const contentType = parts[0] === 'intl-en' || parts[0] === 'intl-fr' ? parts[1] : parts[0];
    const contentId = parts[0] === 'intl-en' || parts[0] === 'intl-fr' ? parts[2] : parts[1];
    if (!contentType || !contentId || !['track', 'album', 'playlist', 'episode', 'show'].includes(contentType)) return null;
    if (!/^[A-Za-z0-9]+$/.test(contentId)) return null;
    return {
      provider: 'Spotify',
      src: `https://open.spotify.com/embed/${contentType}/${contentId}`,
      aspectRatio: 'audio',
    };
  }

  if (hostname === 'youtube.com' || hostname === 'www.youtube.com' || hostname === 'music.youtube.com' || hostname === 'youtu.be' || hostname === 'www.youtu.be') {
    const videoId = getVideoId(url);
    if (!videoId || !/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) return null;
    return {
      provider: 'YouTube',
      src: `https://www.youtube-nocookie.com/embed/${videoId}`,
      aspectRatio: 'video',
    };
  }

  if (hostname === 'soundcloud.com' || hostname === 'www.soundcloud.com' || hostname === 'on.soundcloud.com') {
    if (!url.pathname.split('/').filter(Boolean).length) return null;
    const params = new URLSearchParams({
      url: url.toString(),
      color: '#3b82f6',
      auto_play: 'false',
      hide_related: 'true',
      show_comments: 'false',
      show_user: 'true',
      show_reposts: 'false',
      show_teaser: 'false',
      visual: 'false',
    });
    return {
      provider: 'SoundCloud',
      src: `https://w.soundcloud.com/player/?${params.toString()}`,
      aspectRatio: 'audio',
    };
  }

  if (hostname === 'music.apple.com' || hostname === 'www.music.apple.com' || hostname === 'embed.music.apple.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2 || !/^[a-z]{2}$/i.test(parts[0])) return null;
    return {
      provider: 'Apple Music',
      src: `https://embed.music.apple.com/${parts.join('/')}${url.search}`,
      aspectRatio: 'audio',
    };
  }

  return null;
}
