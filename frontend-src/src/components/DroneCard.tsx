'use client';

import React from 'react';

interface DroneCardProps {
  drone: {
    id: string;
    name: string;
    serialNumber: string;
    model: string;
    status: 'active' | 'inactive' | 'maintenance' | 'flying' | 'charging' | 'error';
    batteryLevel: number;
    lastMaintenance: string;
    nextMaintenance: string;
    currentLocation?: {
      coordinates: [number, number];
      altitude: number;
    };
  };
  onClick?: () => void;
}

export default function DroneCard({ drone, onClick }: DroneCardProps) {
  // Função para determinar a cor da bateria com base no nível
  const getBatteryColor = (level: number) => {
    if (level > 70) return 'bg-green-500';
    if (level > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Função para determinar a classe do status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'flying': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'charging': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  // Função para formatar o status em português
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'Ativo',
      inactive: 'Inativo',
      maintenance: 'Manutenção',
      flying: 'Em voo',
      charging: 'Carregando',
      error: 'Erro'
    };
    return statusMap[status] || status;
  };

  return (
    <div 
      className="dashboard-card cursor-pointer hover:translate-y-[-2px] transition-all"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{drone.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(drone.status)}`}>
          {formatStatus(drone.status)}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        <p>Modelo: {drone.model}</p>
        <p>Serial: {drone.serialNumber}</p>
      </div>
      
      <div className="flex items-center mb-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Bateria:</div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getBatteryColor(drone.batteryLevel)}`} 
            style={{ width: `${drone.batteryLevel}%` }}
          ></div>
        </div>
        <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{drone.batteryLevel}%</div>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        <p>Última manutenção: {new Date(drone.lastMaintenance).toLocaleDateString('pt-BR')}</p>
        <p>Próxima manutenção: {new Date(drone.nextMaintenance).toLocaleDateString('pt-BR')}</p>
      </div>
      
      {drone.currentLocation && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <p>Localização: {drone.currentLocation.coordinates[1].toFixed(6)}, {drone.currentLocation.coordinates[0].toFixed(6)}</p>
          <p>Altitude: {drone.currentLocation.altitude}m</p>
        </div>
      )}
    </div>
  );
}
