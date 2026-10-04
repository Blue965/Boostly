import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'small' | 'medium';
  wordmarkClassName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'medium', wordmarkClassName = '' }) => (
  <span className="inline-flex items-center gap-3">
    <BrandMark size={size} />
    <span className={`font-extrabold tracking-[0.19em] text-white ${size === 'small' ? 'text-xs' : 'text-sm'} ${wordmarkClassName}`}>
      BOOSTLY
    </span>
  </span>
);

const BrandMark: React.FC<{ size: 'small' | 'medium' }> = ({ size }) => {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const sizeClass = size === 'small' ? 'h-7 w-7' : 'h-10 w-10';

  if (imageUnavailable) {
    return (
      <span aria-hidden="true" className={`flex ${sizeClass} items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-500/20`}>
        B
      </span>
    );
  }

  return (
    <img
      src="/Boostly.png"
      alt=""
      aria-hidden="true"
      className={`${sizeClass} rounded-xl object-contain`}
      onError={() => setImageUnavailable(true)}
    />
  );
};
