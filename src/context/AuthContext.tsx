import React, { createContext, useContext } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';

interface AuthContextType {
  user: ReturnType<typeof useUser>['user'];
  session: null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, session: null, loading: true, signOut: async () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const signOut = async () => {
    await clerkSignOut();
  };

  return (
    <AuthContext.Provider value={{ user, session: null, loading: !isLoaded, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
