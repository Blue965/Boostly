import React from 'react';
import { Profile, PageConfig, LinkItem } from '../../types/database.types';

interface LivePreviewProps {
  profile: Profile | null;
  page: PageConfig | null;
  links: LinkItem[];
}

export const LivePreview: React.FC<LivePreviewProps> = ({ profile, page, links }) => {
  if (!page || !profile) return null;

  return (
    <div className="w-[320px] h-[640px] bg-slate-950 border-[8px] border-slate-800 rounded-[40px] shadow-2xl p-4 flex flex-col justify-between overflow-y-auto relative sticky top-6">
      <div className="flex flex-col items-center space-y-4 pt-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-white/20 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            (profile.display_name || profile.username || 'U').charAt(0).toUpperCase()
          )}
        </div>

        {/* Title/Bio */}
        <div className="text-center">
          <h3 className="text-base font-bold text-white">{profile.display_name || `@${profile.username}`}</h3>
          {profile.bio && <p className="text-xs text-slate-400 mt-1 max-w-[240px]">{profile.bio}</p>}
        </div>

        {/* Links */}
        <div className="w-full space-y-2 pt-2">
          {links.filter(l => l.is_active).map((link) => (
            <div
              key={link.id}
              className={`w-full py-2.5 px-4 text-center text-xs font-semibold shadow-sm transition ${
                page.button_style === 'pill' ? 'rounded-full' :
                page.button_style === 'square' ? 'rounded-none' :
                page.button_style === 'outline' ? 'border border-blue-500 bg-transparent text-white' : 'rounded-lg'
              }`}
              style={{
                backgroundColor: page.button_style === 'outline' ? 'transparent' : page.accent_color,
                color: '#ffffff'
              }}
            >
              {link.title}
            </div>
          ))}
        </div>
      </div>

      {!page.hide_branding && (
        <div className="text-center py-2 text-[10px] text-slate-600 font-medium tracking-widest uppercase">
          Powered by Boostly
        </div>
      )}
    </div>
  );
};