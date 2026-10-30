import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export const LoginPage: React.FC = () => (
  <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.16),transparent_55%),#070b16] flex items-center justify-center p-4">
    <SignIn routing="path" path="/login" signUpUrl="/signup" fallbackRedirectUrl="/dashboard" appearance={{ elements: { rootBox: 'w-full max-w-md', card: 'bg-[#0d1423] border border-white/[0.09] shadow-2xl', headerTitle: 'text-white', headerSubtitle: 'text-slate-400', formFieldLabel: 'text-slate-300', formFieldInput: 'bg-[#080d18] border-white/[0.09] text-white', formButtonPrimary: 'bg-blue-500 hover:bg-blue-400' } }} />
  </div>
);
