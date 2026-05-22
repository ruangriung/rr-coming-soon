import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = () => {
    window.location.href = '/api/auth/login';
  };

  const logout = () => {
    localStorage.removeItem('rr_user');
    setUser(null);
    toast.success('Berhasil keluar!');
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const success = url.searchParams.get('login_success');
    const encodedUser = url.searchParams.get('user');
    const loginError = url.searchParams.get('login_error');

    if (loginError) {
      toast.error(`Login gagal: ${decodeURIComponent(loginError)}`);
      // Clean up URL query parameters
      url.searchParams.delete('login_error');
      url.searchParams.delete('message');
      url.searchParams.delete('details');
      window.history.replaceState({}, '', url.pathname + url.searchParams.toString() + url.hash);
    }

    if (success === 'true' && encodedUser) {
      try {
        const decodedString = decodeURIComponent(escape(atob(encodedUser)));
        const parsedUser = JSON.parse(decodedString) as UserProfile;
        
        localStorage.setItem('rr_user', JSON.stringify(parsedUser));
        setUser(parsedUser);
        toast.success(`Selamat datang kembali, ${parsedUser.name}!`);
      } catch (err) {
        console.error('Failed to parse user profile:', err);
        toast.error('Gagal memproses profil pengguna');
      } finally {
        // Clean up URL query parameters so URL remains clean
        url.searchParams.delete('login_success');
        url.searchParams.delete('user');
        window.history.replaceState({}, '', url.pathname + url.searchParams.toString() + url.hash);
      }
    } else {
      const savedUser = localStorage.getItem('rr_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser) as UserProfile);
        } catch (err) {
          localStorage.removeItem('rr_user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
