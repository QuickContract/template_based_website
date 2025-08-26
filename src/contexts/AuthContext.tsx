import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage on mount
    const storedAuth = localStorage.getItem('quickContractAuth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsLoggedIn(true);
      setUser(authData.user);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Fixed credentials
    if (email === 'quickcontract@admin.com' && password === 'Admin@123') {
      const userData = { email, role: 'admin' };
      setIsLoggedIn(true);
      setUser(userData);
      localStorage.setItem('quickContractAuth', JSON.stringify({ user: userData }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('quickContractAuth');
    // Note: Navigation will be handled in the component that calls logout
  };

  const value = {
    isLoggedIn,
    login,
    logout,
    user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
