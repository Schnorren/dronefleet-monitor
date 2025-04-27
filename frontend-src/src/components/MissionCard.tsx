'use client';

import React from 'react';

interface MissionCardProps {
  mission: {
    id: string;
    name: string;
    description: string;
    status: 'planned' | 'in_progress' | 'completed' | 'aborted' | 'failed';
    drone: {
      id: string;
      name: string;
    };
    plannedStartTime: string;
    plannedEndTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    waypoints: number;
  };
  onClick?: () => void;
}

export default function MissionCard({ mission, onClick }: MissionCardProps) {
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

  // Função para calcular a duração da missão
  const calculateDuration = () => {
    if (mission.status === 'completed' && mission.actualStartTime && mission.actualEndTime) {
      const start = new Date(mission.actualStartTime);
      const end = new Date(mission.actualEndTime);
      const durationMs = end.getTime() - start.getTime();
      const minutes = Math.floor(durationMs / 60000);
      return `${minutes} minutos`;
    } else {
      const start = new Date(mission.plannedStartTime);
      const end = new Date(mission.plannedEndTime);
      const durationMs = end.getTime() - start.getTime();
      const minutes = Math.floor(durationMs / 60000);
      return `${minutes} minutos (estimado)`;
    }
  };

  return (
    <div 
      className="dashboard-card cursor-pointer hover:translate-y-[-2px] transition-all"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mission.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(mission.status)}`}>
          {formatStatus(mission.status)}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        <p className="line-clamp-2">{mission.description}</p>
      </div>
      
      <div className="text-sm text-gray-700 dark:text-gray-300">
        <p>Drone: {mission.drone.name}</p>
        <p>Waypoints: {mission.waypoints}</p>
        <p>Duração: {calculateDuration()}</p>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {mission.status === 'planned' ? (
          <>
            <p>Início planejado: {new Date(mission.plannedStartTime).toLocaleString('pt-BR')}</p>
            <p>Término planejado: {new Date(mission.plannedEndTime).toLocaleString('pt-BR')}</p>
          </>
        ) : (
          <>
            <p>Início: {mission.actualStartTime ? new Date(mission.actualStartTime).toLocaleString('pt-BR') : 'N/A'}</p>
            <p>Término: {mission.actualEndTime ? new Date(mission.actualEndTime).toLocaleString('pt-BR') : 'Em andamento'}</p>
          </>
        )}
      </div>
    </div>
  );
}
