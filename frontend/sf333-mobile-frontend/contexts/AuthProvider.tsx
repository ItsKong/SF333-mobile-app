import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  userRole: string ;
  setUserRole: (role: string) => void;
  username: string;
  setUsername: (username: string) => void;
  USER_DATA_KEY: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<string >("none");
  const [username, setUsername] = useState<string >("none");
  const USER_DATA_KEY = '@USER_DATA'

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, username, setUsername, USER_DATA_KEY }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}