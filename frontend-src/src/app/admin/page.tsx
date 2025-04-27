'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

// Dados simulados para a lista de usuários
const mockUsers = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@dronefleet.com',
    role: 'admin',
    isActive: true,
    lastLogin: '2025-04-25T08:30:00',
    createdAt: '2025-01-15T10:00:00'
  },
  {
    id: '2',
    name: 'Operador 1',
    email: 'operador1@dronefleet.com',
    role: 'operator',
    isActive: true,
    lastLogin: '2025-04-24T14:45:00',
    createdAt: '2025-01-20T11:30:00'
  },
  {
    id: '3',
    name: 'Operador 2',
    email: 'operador2@dronefleet.com',
    role: 'operator',
    isActive: true,
    lastLogin: '2025-04-23T09:15:00',
    createdAt: '2025-02-05T09:00:00'
  },
  {
    id: '4',
    name: 'Observador 1',
    email: 'observador1@dronefleet.com',
    role: 'observer',
    isActive: true,
    lastLogin: '2025-04-22T16:20:00',
    createdAt: '2025-02-10T14:30:00'
  },
  {
    id: '5',
    name: 'Observador 2',
    email: 'observador2@dronefleet.com',
    role: 'observer',
    isActive: false,
    lastLogin: '2025-03-15T11:10:00',
    createdAt: '2025-02-15T10:45:00'
  }
];

// Dados simulados para logs de auditoria
const mockAuditLogs = [
  {
    id: '1',
    userId: '1',
    userName: 'Administrador',
    action: 'Criação de drone',
    details: 'Criou o drone Falcon-1',
    timestamp: '2025-04-25T09:30:00',
    ipAddress: '192.168.1.10'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Operador 1',
    action: 'Início de missão',
    details: 'Iniciou a missão Inspeção Perímetro Norte',
    timestamp: '2025-04-25T08:05:00',
    ipAddress: '192.168.1.15'
  },
  {
    id: '3',
    userId: '1',
    userName: 'Administrador',
    action: 'Criação de usuário',
    details: 'Criou o usuário Observador 3',
    timestamp: '2025-04-24T16:45:00',
    ipAddress: '192.168.1.10'
  },
  {
    id: '4',
    userId: '3',
    userName: 'Operador 2',
    action: 'Conclusão de missão',
    details: 'Concluiu a missão Monitoramento Ambiental',
    timestamp: '2025-04-24T15:45:00',
    ipAddress: '192.168.1.20'
  },
  {
    id: '5',
    userId: '1',
    userName: 'Administrador',
    action: 'Geração de relatório',
    details: 'Gerou o relatório de frota Abril 2025',
    timestamp: '2025-04-24T16:30:00',
    ipAddress: '192.168.1.10'
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar usuários com base na pesquisa
  const filteredUsers = mockUsers.filter(user => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Filtrar logs de auditoria com base na pesquisa
  const filteredLogs = mockAuditLogs.filter(log => {
    return (
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Função para formatar o papel do usuário em português
  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: 'Administrador',
      operator: 'Operador',
      observer: 'Observador'
    };
    return roleMap[role] || role;
  };

  // Função para obter a classe de cor do papel
  const getRoleClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'operator': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'observer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administração</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie usuários e visualize logs de auditoria do sistema</p>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                className={`inline-block py-2 px-4 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('users')}
              >
                Usuários
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block py-2 px-4 text-sm font-medium ${
                  activeTab === 'audit'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('audit')}
              >
                Logs de Auditoria
              </button>
            </li>
          </ul>
        </div>
        
        {/* Pesquisa */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder={activeTab === 'users' ? "Buscar por nome, email ou papel..." : "Buscar por usuário, ação ou detalhes..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Conteúdo da Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gestão de Usuários</h2>
              <button className="btn btn-primary">
                <span className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Novo Usuário
                </span>
              </button>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Nome</th>
                    <th className="table-header-cell">Email</th>
                    <th className="table-header-cell">Papel</th>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell">Último Login</th>
                    <th className="table-header-cell">Criado em</th>
                    <th className="table-header-cell">Ações</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="table-row">
                        <td className="table-cell font-medium text-gray-900 dark:text-white">{user.name}</td>
                        <td className="table-cell">{user.email}</td>
                        <td className="table-cell">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleClass(user.role)}`}>
                            {formatRole(user.role)}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          }`}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="table-cell">{new Date(user.lastLogin).toLocaleString('pt-BR')}</td>
                        <td className="table-cell">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <button className="p-1 rounded-md text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-slate-700">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="p-1 rounded-md text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-slate-700">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {user.id !== '1' && (
                              <button className="p-1 rounded-md text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-slate-700">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Nenhum usuário encontrado com os filtros aplicados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'audit' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Logs de Auditoria</h2>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Data e Hora</th>
                    <th className="table-header-cell">Usuário</th>
                    <th className="table-header-cell">Ação</th>
                    <th className="table-header-cell">Detalhes</th>
                    <th className="table-header-cell">Endereço IP</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="table-row">
                        <td className="table-cell">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                        <td className="table-cell font-medium text-gray-900 dark:text-white">{log.userName}</td>
                        <td className="table-cell">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            {log.action}
                          </span>
                        </td>
                        <td className="table-cell">{log.details}</td>
                        <td className="table-cell">{log.ipAddress}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Nenhum log de auditoria encontrado com os filtros aplicados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
