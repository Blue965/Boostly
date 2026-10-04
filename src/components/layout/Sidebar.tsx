import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'My Page', path: '/dashboard/page' },
    { label: 'Appearance', path: '/dashboard/appearance' },
    { label: 'Analytics', path: '/dashboard/analytics' },
    { label: 'Boost AI', path: '/dashboard/boost-ai' },
    { label: 'Subscription', path: '/dashboard/subscription' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex h-screen sticky top-0">
      <div className="p-6">
        <Link to="/dashboard" className="text-xl font-bold tracking-wider text-white flex items-center gap-2 mb-8">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-black text-sm">B</span> BOOSTLY
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-6 border-t border-slate-800">
        <button
          onClick={signOut}
          className="w-full text-left text-sm font-medium text-slate-400 hover:text-red-400 transition"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
};