import React from 'react';
import { LinkItem, PageConfig, Profile } from '../../types/database.types';

interface ProfileCardProps {
  profile: Profile;
  page: PageConfig;
  links: LinkItem[];
  preview?: boolean;
  onLinkClick?: (link: LinkItem, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

function getButtonRadius(style: PageConfig['button_style']): string {
  switch (style) {
    case 'pill': return 'rounded-full';
    case 'square': return 'rounded-md';
    case 'outline': return 'rounded-xl';
    default: return 'rounded-xl';
  }
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, page, links, preview = false, onLinkClick }) => {
  const activeLinks = links.filter((link) => link.is_active);
  const title = page.title || profile.display_name || `@${profile.username}`;

  return (
    <section className={`profile-card profile-card--${page.card_theme || 'glass'} w-full max-w-md`}>
      <div className="profile-card__content flex flex-col items-center px-6 py-8 text-center sm:px-8">
        <div className="profile-card__avatar mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-slate-900/60 text-3xl font-bold text-white shadow-xl">
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt={`${profile.display_name || profile.username} — photo de profil`} className="h-full w-full object-cover" />
            : (profile.display_name || profile.username).charAt(0).toUpperCase()}
        </div>

        <h1 className="profile-card__title text-2xl font-bold tracking-tight text-white">{title}</h1>
        {profile.bio && <p className="mt-2 max-w-sm whitespace-pre-wrap text-sm leading-relaxed text-slate-200/90">{profile.bio}</p>}
        {page.music_url && (
          <div className="mt-6 w-full">
            {page.music_type === 'video/mp4'
              ? <video className="w-full rounded-xl" src={page.music_url} controls playsInline preload="metadata" aria-label={`Média musical de ${title}`} />
              : <audio className="w-full" src={page.music_url} controls preload="metadata" aria-label={`Musique de ${title}`} />}
          </div>
        )}

        <div className="mt-7 w-full space-y-3">
          {activeLinks.length === 0 ? (
            <p className="py-5 text-sm text-slate-300/80">Aucun lien disponible.</p>
          ) : activeLinks.map((link) => {
            const linkClass = `block w-full px-5 py-3.5 text-center font-semibold shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 ${getButtonRadius(page.button_style)} ${
              page.button_style === 'outline' ? 'border-2 text-white' : 'text-white'
            }`;
            const linkStyle: React.CSSProperties = {
              backgroundColor: page.button_style === 'outline' ? 'transparent' : page.accent_color,
              borderColor: page.accent_color,
              color: '#ffffff',
            };

            if (preview) {
              return <div key={link.id} className={linkClass} style={linkStyle}>{link.title}</div>;
            }
            return (
              <a
                key={link.id}
                href={link.url}
                onClick={(event) => onLinkClick?.(link, event)}
                className={linkClass}
                style={linkStyle}
              >
                {link.title}
              </a>
            );
          })}
        </div>
        {!page.hide_branding && (
          <div className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Powered by Boostly
          </div>
        )}
      </div>
    </section>
  );
};
