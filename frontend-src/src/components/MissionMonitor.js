'use client';

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { missionService } from '@/lib/api';

// Componente para monitoramento em tempo real de missões
export default function MissionMonitor({ missionId }) {
  const { activeDrones, subscribeToDrone, unsubscribeFromDrone } = useWebSocket();
  const [mission, setMission] = useState(null);
  const [droneData, setDroneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [progress, setProgress] = useState(0);

  // Buscar dados iniciais da missão
  useEffect(() => {
    const fetchMissionData = async () => {
      try {
        setLoading(true);
        const response = await missionService.getMission(missionId);
        setMission(response.data);
        
        // Buscar telemetria da missão
        const telemetryResponse = await missionService.getMissionTelemetry(missionId);
        setWaypoints(telemetryResponse.data.waypoints || []);
        
        // Inscrever-se para atualizações do drone associado à missão
        if (response.data.drone && response.data.drone.id) {
          subscribeToDrone(response.data.drone.id);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da missão:', error);
        setError('Não foi possível carregar os dados da missão. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();

    // Cancelar inscrição ao desmontar
    return () => {
      if (mission && mission.drone) {
        unsubscribeFromDrone(mission.drone.id);
      }
    };
  }, [missionId, subscribeToDrone, unsubscribeFromDrone]);

  // Atualizar dados do drone quando houver mudanças nos drones ativos
  useEffect(() => {
    if (mission && mission.drone && activeDrones && activeDrones[mission.drone.id]) {
      setDroneData(activeDrones[mission.drone.id]);
      
      // Calcular progresso da missão com base na posição atual e waypoints
      if (waypoints.length > 0 && activeDrones[mission.drone.id].coordinates) {
        // Lógica simplificada para calcular progresso
        // Em uma implementação real, seria necessário calcular a distância percorrida
        // em relação ao total do percurso planejado
        const completedWaypoints = waypoints.filter(wp => wp.status === 'completed').length;
        const newProgress = Math.round((completedWaypoints / waypoints.length) * 100);
        setProgress(newProgress);
      }
    }
  }, [activeDrones, mission, waypoints]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando dados da missão...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            <button 
              className="mt-2 text-sm text-red-700 dark:text-red-200 underline"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              Não há dados disponíveis para esta missão.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Formatar status da missão em português
  const formatMissionStatus = (status) => {
    const statusMap = {
      planned: 'Planejada',
      in_progress: 'Em andamento',
      completed: 'Concluída',
      aborted: 'Abortada',
      failed: 'Falhou'
    };
    return statusMap[status] || status;
  };

  // Obter classe CSS para o status da missão
  const getMissionStatusClass = (status) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'aborted': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  // Formatar coordenadas para exibição
  const formatCoordinates = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return 'N/A';
    }
    return `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
  };

  // Formatar timestamp para exibição
  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return 'N/A';
    }
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mission.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMissionStatusClass(mission.status)}`}>
          {formatMissionStatus(mission.status)}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Descrição</p>
        <p className="text-base text-gray-900 dark:text-white">{mission.description}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Drone</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {mission.drone ? mission.drone.name : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Waypoints</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {waypoints.length}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Início Planejado</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {formatTimestamp(mission.plannedStartTime)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Término Planejado</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {formatTimestamp(mission.plannedEndTime)}
          </p>
        </div>
      </div>
      
      {mission.status === 'in_progress' && (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Progresso da Missão</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div 
                className="h-2.5 rounded-full bg-blue-600" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-right">{progress}%</p>
          </div>
          
          {droneData && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Telemetria do Drone</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Posição Atual</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatCoordinates(droneData.coordinates)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Altitude</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {droneData.altitude ? `${droneData.altitude.toFixed(1)}m` : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Velocidade</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {droneData.speed ? `${droneData.speed.toFixed(1)} km/h` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bateria</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          (droneData.batteryLevel || 0) > 70 ? 'bg-green-500' : 
                          (droneData.batteryLevel || 0) > 30 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`} 
                        style={{ width: `${droneData.batteryLevel || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {droneData.batteryLevel || 0}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Última Atualização</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {formatTimestamp(droneData.lastUpdate)}
                </p>
              </div>
            </div>
          )}
        </>
      )}
      
      {(mission.status === 'completed' || mission.status === 'aborted' || mission.status === 'failed') && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Início Real</p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {formatTimestamp(mission.actualStartTime)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Término Real</p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {formatTimestamp(mission.actualEndTime)}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-4">
        {mission.status === 'planned' && (
          <button 
            className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => missionService.startMission(mission.id)}
          >
            Iniciar Missão
          </button>
        )}
        
        {mission.status === 'in_progress' && (
          <>
            <button 
              className="px-3 py-1.5 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              onClick={() => missionService.abortMission(mission.id)}
            >
              Abortar Missão
            </button>
            <button 
              className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => missionService.completeMission(mission.id)}
            >
              Concluir Missão
            </button>
          </>
        )}
        
        <button 
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => missionService.generateMissionReport(mission.id)}
        >
          Gerar Relatório
        </button>
      </div>
    </div>
  );
}
