import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'passenger' | 'rider' | 'admin';
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userType: 'passenger' | 'rider' | 'admin' | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);
  
  const login = (userData: any, newToken: string) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', newToken);
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  
  const contextValue: AuthContextType = {
    user, 
    token, 
    login, 
    logout, 
    isAuthenticated: !!token,
    userType: user?.userType || null
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};