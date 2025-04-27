'use client';

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { droneService } from '@/lib/api';

// Componente para exibir telemetria em tempo real de um drone
export default function DroneTelemetry({ droneId }) {
  const { activeDrones, subscribeToDrone, unsubscribeFromDrone, sendCommand } = useWebSocket();
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar dados iniciais de telemetria e inscrever-se para atualizações
  useEffect(() => {
    const fetchInitialTelemetry = async () => {
      try {
        setLoading(true);
        const response = await droneService.getDroneTelemetry(droneId);
        setTelemetry(response.data);
        
        // Inscrever-se para atualizações em tempo real
        subscribeToDrone(droneId);
      } catch (error) {
        console.error('Erro ao buscar telemetria inicial:', error);
        setError('Não foi possível carregar os dados de telemetria. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialTelemetry();

    // Cancelar inscrição ao desmontar
    return () => {
      unsubscribeFromDrone(droneId);
    };
  }, [droneId, subscribeToDrone, unsubscribeFromDrone]);

  // Atualizar telemetria quando houver mudanças nos dados do drone ativo
  useEffect(() => {
    if (activeDrones && activeDrones[droneId]) {
      setTelemetry(prev => ({
        ...prev,
        ...activeDrones[droneId]
      }));
    }
  }, [activeDrones, droneId]);

  // Função para enviar comando para o drone
  const handleSendCommand = async (command, parameters = {}) => {
    try {
      await sendCommand(droneId, command, parameters);
      return true;
    } catch (error) {
      console.error(`Erro ao enviar comando ${command}:`, error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando telemetria...</p>
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

  if (!telemetry) {
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
              Não há dados de telemetria disponíveis para este drone.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Formatar coordenadas para exibição
  const formatCoordinates = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return 'N/A';
    }
    return `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
  };

  // Formatar altitude para exibição
  const formatAltitude = (altitude) => {
    if (altitude === undefined || altitude === null) {
      return 'N/A';
    }
    return `${altitude.toFixed(1)}m`;
  };

  // Formatar velocidade para exibição
  const formatSpeed = (speed) => {
    if (speed === undefined || speed === null) {
      return 'N/A';
    }
    return `${speed.toFixed(1)} km/h`;
  };

  // Formatar direção para exibição
  const formatHeading = (heading) => {
    if (heading === undefined || heading === null) {
      return 'N/A';
    }
    return `${heading.toFixed(1)}°`;
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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Telemetria em Tempo Real</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {telemetry.status || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Bateria</p>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
              <div 
                className={`h-2.5 rounded-full ${
                  (telemetry.batteryLevel || 0) > 70 ? 'bg-green-500' : 
                  (telemetry.batteryLevel || 0) > 30 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`} 
                style={{ width: `${telemetry.batteryLevel || 0}%` }}
              ></div>
            </div>
            <span className="text-base font-medium text-gray-900 dark:text-white">
              {telemetry.batteryLevel || 0}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Coordenadas</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {formatCoordinates(telemetry.coordinates)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Altitude</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {formatAltitude(telemetry.altitude)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Velocidade</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {formatSpeed(telemetry.speed)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Direção</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {formatHeading(telemetry.heading)}
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Última atualização</p>
        <p className="text-base font-medium text-gray-900 dark:text-white">
          {formatTimestamp(telemetry.lastUpdate)}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <button 
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleSendCommand('takeoff')}
        >
          Decolar
        </button>
        <button 
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleSendCommand('land')}
        >
          Pousar
        </button>
        <button 
          className="px-3 py-1.5 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          onClick={() => handleSendCommand('return_home')}
        >
          Retornar
        </button>
        <button 
          className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={() => handleSendCommand('emergency_stop')}
        >
          Parada Emergencial
        </button>
      </div>
    </div>
  );
}
