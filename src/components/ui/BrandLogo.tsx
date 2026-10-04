import React from 'react';
import boostlyMark from '../../assets/boostly-mark.svg';

interface BrandLogoProps {
  size?: 'small' | 'medium';
  wordmarkClassName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'medium', wordmarkClassName = '' }) => (
  <span className="inline-flex items-center gap-3">
    <img
      src={boostlyMark}
      alt=""
      aria-hidden="true"
      className={size === 'small' ? 'h-7 w-7' : 'h-10 w-10'}
    />
    <span className={`font-extrabold tracking-[0.19em] text-white ${size === 'small' ? 'text-xs' : 'text-sm'} ${wordmarkClassName}`}>
      BOOSTLY
    </span>
  </span>
);
