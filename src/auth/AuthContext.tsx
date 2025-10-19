import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { authService } from 'src/services/auth.service';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
  
      const userData = await authService.login(credentials);
      const data = userData.data || userData;
      const token = data.token;
      const { token: _, expiresIn, ...user } = data;
      if (!token) {
        throw new Error('Token di accesso non ricevuto dal server');
      }
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Token ricevuto non valido:', token);
        throw new Error('Token JWT non valido ricevuto dal server');
      }

      setUser(user as User);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('auth_token', token);

    } catch (error) {
      console.error('Errore durante il login:', error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // await authService.logout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve essere usato all'interno di AuthProvider");
  }
  return context;
};
