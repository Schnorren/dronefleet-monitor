'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/api';

// Criar contexto de autenticação
const AuthContext = createContext(null);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Verificar se há token no localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Obter perfil do usuário
        const response = await authService.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Limpar dados de autenticação em caso de erro
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Função de login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data;
    } catch (error) {
      setError(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.updateProfile(userData);
      setUser(data.data);
      return data;
    } catch (error) {
      setError(error.message || 'Erro ao atualizar perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verificar se o usuário tem determinada permissão
  const hasPermission = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      admin: 3,
      operator: 2,
      observer: 1
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  // Valores expostos pelo contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    hasPermission,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
