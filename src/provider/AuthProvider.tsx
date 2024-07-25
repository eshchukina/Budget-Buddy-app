import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, StyleSheet} from 'react-native';

interface AuthContextType {
  isAuthenticated: boolean;
  token: any;
  login: (id: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setIsAuthenticated(true);
        setToken(token);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={styles.container}>
        {/* <ActivityIndicator size="large" color="#606e52" /> */}
      </View>
    );
  }

  const login = async (token): Promise<void> => {
    await AsyncStorage.setItem('accessToken', token);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('accessToken');

    setToken(null);
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, token, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efeae7',
  },
});
