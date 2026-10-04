import React from 'react';
import { Profile, PageConfig, LinkItem } from '../../types/database.types';
import { ProfileCard } from './ProfileCard';

interface LivePreviewProps {
  profile: Profile | null;
  page: PageConfig | null;
  links: LinkItem[];
}

export const LivePreview: React.FC<LivePreviewProps> = ({ profile, page, links }) => {
  if (!page || !profile) return null;

  return (
    <div
      className="sticky top-6 flex h-[680px] w-[320px] flex-col items-center justify-start gap-5 overflow-y-auto rounded-[40px] border-[8px] border-slate-800 bg-cover bg-center p-4 shadow-2xl"
      style={{
        backgroundColor: page.background_color,
        backgroundImage: page.background_image_url
          ? `linear-gradient(rgba(2, 6, 23, 0.42), rgba(2, 6, 23, 0.62)), url("${page.background_image_url}")`
          : undefined,
        fontFamily: page.font_family,
      }}
    >
      <ProfileCard profile={profile} page={page} links={links} preview />
    </div>
  );
};
