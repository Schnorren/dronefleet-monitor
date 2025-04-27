'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';

// Dados simulados para a lista de missões
const mockMissions = [
  {
    id: '1',
    name: 'Inspeção Perímetro Norte',
    description: 'Inspeção de segurança do perímetro norte da instalação industrial.',
    status: 'in_progress',
    drone: {
      id: '1',
      name: 'Falcon-1',
      status: 'flying'
    },
    plannedStartTime: '2025-04-25T08:00:00',
    plannedEndTime: '2025-04-25T10:00:00',
    actualStartTime: '2025-04-25T08:05:00',
    waypoints: 12,
    createdBy: 'Administrador',
    createdAt: '2025-04-24T14:30:00'
  },
  {
    id: '2',
    name: 'Mapeamento Área Sul',
    description: 'Mapeamento topográfico da área sul para análise de terreno.',
    status: 'planned',
    drone: {
      id: '2',
      name: 'Eagle-2',
      status: 'active'
    },
    plannedStartTime: '2025-04-26T09:00:00',
    plannedEndTime: '2025-04-26T11:30:00',
    waypoints: 18,
    createdBy: 'Operador 1',
    createdAt: '2025-04-23T10:15:00'
  },
  {
    id: '3',
    name: 'Monitoramento Ambiental',
    description: 'Coleta de dados ambientais e monitoramento de fauna na reserva.',
    status: 'completed',
    drone: {
      id: '3',
      name: 'Hawk-3',
      status: 'active'
    },
    plannedStartTime: '2025-04-24T14:00:00',
    plannedEndTime: '2025-04-24T16:00:00',
    actualStartTime: '2025-04-24T14:10:00',
    actualEndTime: '2025-04-24T15:45:00',
    waypoints: 15,
    createdBy: 'Operador 2',
    createdAt: '2025-04-22T09:30:00'
  },
  {
    id: '4',
    name: 'Inspeção de Torres',
    description: 'Inspeção visual das torres de transmissão na área leste.',
    status: 'aborted',
    drone: {
      id: '4',
      name: 'Raven-4',
      status: 'maintenance'
    },
    plannedStartTime: '2025-04-23T10:00:00',
    plannedEndTime: '2025-04-23T12:00:00',
    actualStartTime: '2025-04-23T10:05:00',
    actualEndTime: '2025-04-23T10:35:00',
    waypoints: 8,
    createdBy: 'Administrador',
    createdAt: '2025-04-21T16:45:00'
  },
  {
    id: '5',
    name: 'Detecção de Vazamentos',
    description: 'Inspeção térmica para detecção de vazamentos na tubulação principal.',
    status: 'failed',
    drone: {
      id: '5',
      name: 'Osprey-5',
      status: 'error'
    },
    plannedStartTime: '2025-04-22T13:00:00',
    plannedEndTime: '2025-04-22T14:30:00',
    actualStartTime: '2025-04-22T13:10:00',
    actualEndTime: '2025-04-22T13:25:00',
    waypoints: 6,
    createdBy: 'Operador 1',
    createdAt: '2025-04-20T11:20:00'
  },
  {
    id: '6',
    name: 'Monitoramento de Tráfego',
    description: 'Monitoramento do fluxo de tráfego nas vias de acesso principal.',
    status: 'planned',
    drone: {
      id: '6',
      name: 'Condor-6',
      status: 'charging'
    },
    plannedStartTime: '2025-04-27T07:00:00',
    plannedEndTime: '2025-04-27T09:00:00',
    waypoints: 10,
    createdBy: 'Operador 2',
    createdAt: '2025-04-24T17:30:00'
  },
];

// Função para formatar o status em português
const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    planned: 'Planejada',
    in_progress: 'Em andamento',
    completed: 'Concluída',
    aborted: 'Abortada',
    failed: 'Falhou'
  };
  return statusMap[status] || status;
};

// Função para determinar a classe do status
const getStatusClass = (status: string) => {
  switch (status) {
    case 'planned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'aborted': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
  }
};

export default function MissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filtrar missões com base na pesquisa e filtro de status
  const filteredMissions = mockMissions.filter(mission => {
    const matchesSearch = 
      mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.drone.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || mission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Missões</h1>
          <p className="text-gray-600 dark:text-gray-400">Planeje, monitore e analise missões de drones</p>
        </div>
        
        {/* Filtros e Pesquisa */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Buscar por nome, descrição ou drone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="planned">Planejada</option>
              <option value="in_progress">Em andamento</option>
              <option value="completed">Concluída</option>
              <option value="aborted">Abortada</option>
              <option value="failed">Falhou</option>
            </select>
          </div>
          <div>
            <button className="btn btn-primary">
              <span className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nova Missão
              </span>
            </button>
          </div>
        </div>
        
        {/* Tabela de Missões */}
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Nome</th>
                <th className="table-header-cell">Drone</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Início Planejado</th>
                <th className="table-header-cell">Término Planejado</th>
                <th className="table-header-cell">Waypoints</th>
                <th className="table-header-cell">Criado por</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredMissions.length > 0 ? (
                filteredMissions.map((mission) => (
                  <tr key={mission.id} className="table-row">
                    <td className="table-cell font-medium text-gray-900 dark:text-white">
                      <div>
                        <div>{mission.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{mission.description}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div>{mission.drone.name}</div>
                        <div className="mt-1">
                          <StatusBadge status={mission.drone.status as any} className="text-xs py-0.5 px-1.5" />
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(mission.status)}`}>
                        {formatStatus(mission.status)}
                      </span>
                    </td>
                    <td className="table-cell">{new Date(mission.plannedStartTime).toLocaleString('pt-BR')}</td>
                    <td className="table-cell">{new Date(mission.plannedEndTime).toLocaleString('pt-BR')}</td>
                    <td className="table-cell">{mission.waypoints}</td>
                    <td className="table-cell">
                      <div>
                        <div>{mission.createdBy}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(mission.createdAt).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button className="p-1 rounded-md text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-slate-700">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {mission.status === 'planned' && (
                          <>
                            <button className="p-1 rounded-md text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-slate-700">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button className="p-1 rounded-md text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-slate-700">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-1 rounded-md text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-slate-700">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                        {mission.status === 'in_progress' && (
                          <>
                            <button className="p-1 rounded-md text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-slate-700">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button className="p-1 rounded-md text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-slate-700">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </>
                        )}
                        {(mission.status === 'completed' || mission.status === 'aborted' || mission.status === 'failed') && (
                          <button className="p-1 rounded-md text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-slate-700">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma missão encontrada com os filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
