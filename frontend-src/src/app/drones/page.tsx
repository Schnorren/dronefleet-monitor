'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';

// Dados simulados para a lista de drones
const mockDrones = [
  {
    id: '1',
    name: 'Falcon-1',
    serialNumber: 'DRN-2025-001',
    model: 'DJI Mavic 3 Pro',
    status: 'flying',
    batteryLevel: 78,
    lastMaintenance: '2025-03-15',
    nextMaintenance: '2025-06-15',
    totalFlightHours: 124.5,
    sensors: ['camera', 'thermal', 'lidar']
  },
  {
    id: '2',
    name: 'Eagle-2',
    serialNumber: 'DRN-2025-002',
    model: 'Autel EVO II',
    status: 'active',
    batteryLevel: 92,
    lastMaintenance: '2025-04-01',
    nextMaintenance: '2025-07-01',
    totalFlightHours: 87.2,
    sensors: ['camera', 'multispectral']
  },
  {
    id: '3',
    name: 'Hawk-3',
    serialNumber: 'DRN-2025-003',
    model: 'Skydio 2+',
    status: 'maintenance',
    batteryLevel: 45,
    lastMaintenance: '2025-02-10',
    nextMaintenance: '2025-05-10',
    totalFlightHours: 156.8,
    sensors: ['camera', 'thermal']
  },
  {
    id: '4',
    name: 'Raven-4',
    serialNumber: 'DRN-2025-004',
    model: 'DJI Phantom 4 RTK',
    status: 'inactive',
    batteryLevel: 0,
    lastMaintenance: '2025-01-20',
    nextMaintenance: '2025-04-20',
    totalFlightHours: 210.3,
    sensors: ['camera', 'lidar']
  },
  {
    id: '5',
    name: 'Osprey-5',
    serialNumber: 'DRN-2025-005',
    model: 'Parrot Anafi Thermal',
    status: 'charging',
    batteryLevel: 35,
    lastMaintenance: '2025-03-25',
    nextMaintenance: '2025-06-25',
    totalFlightHours: 62.7,
    sensors: ['camera', 'thermal']
  },
  {
    id: '6',
    name: 'Condor-6',
    serialNumber: 'DRN-2025-006',
    model: 'Yuneec H520',
    status: 'error',
    batteryLevel: 12,
    lastMaintenance: '2025-02-28',
    nextMaintenance: '2025-05-28',
    totalFlightHours: 178.1,
    sensors: ['camera', 'thermal', 'gas']
  },
];

export default function DronesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filtrar drones com base na pesquisa e filtro de status
  const filteredDrones = mockDrones.filter(drone => {
    const matchesSearch = 
      drone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drone.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drone.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || drone.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Drones</h1>
          <p className="text-gray-600 dark:text-gray-400">Visualize, monitore e gerencie sua frota de drones</p>
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
                placeholder="Buscar por nome, serial ou modelo..."
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
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="maintenance">Manutenção</option>
              <option value="flying">Em voo</option>
              <option value="charging">Carregando</option>
              <option value="error">Erro</option>
            </select>
          </div>
          <div>
            <button className="btn btn-primary">
              <span className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Novo Drone
              </span>
            </button>
          </div>
        </div>
        
        {/* Tabela de Drones */}
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Nome</th>
                <th className="table-header-cell">Modelo</th>
                <th className="table-header-cell">Número de Série</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Bateria</th>
                <th className="table-header-cell">Horas de Voo</th>
                <th className="table-header-cell">Próxima Manutenção</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredDrones.length > 0 ? (
                filteredDrones.map((drone) => (
                  <tr key={drone.id} className="table-row">
                    <td className="table-cell font-medium text-gray-900 dark:text-white">{drone.name}</td>
                    <td className="table-cell">{drone.model}</td>
                    <td className="table-cell">{drone.serialNumber}</td>
                    <td className="table-cell">
                      <StatusBadge status={drone.status as any} />
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              drone.batteryLevel > 70 ? 'bg-green-500' : 
                              drone.batteryLevel > 30 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${drone.batteryLevel}%` }}
                          ></div>
                        </div>
                        <span>{drone.batteryLevel}%</span>
                      </div>
                    </td>
                    <td className="table-cell">{drone.totalFlightHours}h</td>
                    <td className="table-cell">{new Date(drone.nextMaintenance).toLocaleDateString('pt-BR')}</td>
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
                        <button className="p-1 rounded-md text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-slate-700">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum drone encontrado com os filtros aplicados
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
