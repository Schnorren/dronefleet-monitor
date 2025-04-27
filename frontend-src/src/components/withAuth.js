'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// HOC para proteger rotas que requerem autenticação
export default function withAuth(Component, requiredRole = null) {
  return function ProtectedRoute(props) {
    const { user, loading, isAuthenticated, hasPermission } = useAuth();
    const router = useRouter();

    // Verificar se está carregando
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Carregando...</p>
          </div>
        </div>
      );
    }

    // Redirecionar para login se não estiver autenticado
    if (!isAuthenticated) {
      router.push('/login');
      return null;
    }

    // Verificar permissão se requiredRole for especificado
    if (requiredRole && !hasPermission(requiredRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
          <div className="text-center max-w-md p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <svg className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Acesso Negado</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Você não tem permissão para acessar esta página. Esta página requer privilégios de {requiredRole}.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar para o Dashboard
            </button>
          </div>
        </div>
      );
    }

    // Renderizar o componente protegido
    return <Component {...props} />;
  };
}
