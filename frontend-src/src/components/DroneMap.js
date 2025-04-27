'use client';

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { droneService } from '@/lib/api';

// Componente para exibir o mapa de drones em tempo real
export default function DroneMap() {
  const { activeDrones, subscribeToDrone, unsubscribeFromDrone } = useWebSocket();
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});

  // Buscar lista de drones e inscrever-se para atualizações
  useEffect(() => {
    const fetchDrones = async () => {
      try {
        setLoading(true);
        const response = await droneService.getDrones({ status: 'active,flying' });
        setDrones(response.data);
        
        // Inscrever-se para atualizações de todos os drones ativos
        response.data.forEach(drone => {
          subscribeToDrone(drone.id);
        });
      } catch (error) {
        console.error('Erro ao buscar drones:', error);
        setError('Não foi possível carregar os drones. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrones();

    // Cancelar inscrição ao desmontar
    return () => {
      drones.forEach(drone => {
        unsubscribeFromDrone(drone.id);
      });
    };
  }, [subscribeToDrone, unsubscribeFromDrone]);

  // Inicializar mapa quando os drones forem carregados
  useEffect(() => {
    if (!loading && drones.length > 0 && !mapInitialized) {
      // Verificar se a biblioteca do mapa está disponível
      if (typeof window !== 'undefined' && window.mapboxgl) {
        try {
          // Inicializar o mapa
          const mapboxgl = window.mapboxgl;
          mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.placeholder.token';
          
          // Encontrar o centro do mapa com base na posição média dos drones
          let centerLat = -23.550520; // Coordenadas padrão (São Paulo)
          let centerLng = -46.633308;
          
          // Calcular centro se houver drones com coordenadas
          const dronesWithCoords = drones.filter(drone => 
            drone.currentLocation && 
            drone.currentLocation.coordinates && 
            drone.currentLocation.coordinates.length === 2
          );
          
          if (dronesWithCoords.length > 0) {
            const sumLat = dronesWithCoords.reduce((sum, drone) => 
              sum + drone.currentLocation.coordinates[1], 0);
            const sumLng = dronesWithCoords.reduce((sum, drone) => 
              sum + drone.currentLocation.coordinates[0], 0);
            
            centerLat = sumLat / dronesWithCoords.length;
            centerLng = sumLng / dronesWithCoords.length;
          }
          
          // Criar o mapa
          const mapInstance = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [centerLng, centerLat],
            zoom: 12
          });
          
          // Adicionar controles
          mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
          mapInstance.addControl(new mapboxgl.FullscreenControl(), 'top-right');
          
          // Salvar instância do mapa
          setMap(mapInstance);
          setMapInitialized(true);
          
          // Adicionar marcadores para cada drone
          const markerObjects = {};
          dronesWithCoords.forEach(drone => {
            const el = document.createElement('div');
            el.className = 'drone-marker';
            el.style.width = '24px';
            el.style.height = '24px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor = getStatusColor(drone.status);
            el.style.border = '2px solid white';
            el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
            
            const marker = new mapboxgl.Marker(el)
              .setLngLat([drone.currentLocation.coordinates[0], drone.currentLocation.coordinates[1]])
              .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <h3 style="font-weight: bold;">${drone.name}</h3>
                  <p>Status: ${formatStatus(drone.status)}</p>
                  <p>Bateria: ${drone.batteryLevel}%</p>
                  <p>Altitude: ${drone.currentLocation.altitude}m</p>
                `))
              .addTo(mapInstance);
            
            markerObjects[drone.id] = marker;
          });
          
          setMarkers(markerObjects);
        } catch (error) {
          console.error('Erro ao inicializar mapa:', error);
          setError('Não foi possível inicializar o mapa. Verifique se o token do Mapbox é válido.');
        }
      } else {
        setError('Biblioteca do Mapbox não está disponível.');
      }
    }
  }, [loading, drones, mapInitialized]);

  // Atualizar marcadores quando houver mudanças nos drones ativos
  useEffect(() => {
    if (map && mapInitialized && markers) {
      Object.keys(activeDrones).forEach(droneId => {
        const droneData = activeDrones[droneId];
        
        // Verificar se o drone tem coordenadas
        if (droneData.coordinates && droneData.coordinates.length === 2) {
          // Verificar se já existe um marcador para este drone
          if (markers[droneId]) {
            // Atualizar posição do marcador
            markers[droneId].setLngLat([droneData.coordinates[0], droneData.coordinates[1]]);
            
            // Atualizar popup
            const popup = markers[droneId].getPopup();
            popup.setHTML(`
              <h3 style="font-weight: bold;">${droneData.name || `Drone ${droneId}`}</h3>
              <p>Status: ${formatStatus(droneData.status)}</p>
              <p>Bateria: ${droneData.batteryLevel || 'N/A'}%</p>
              <p>Altitude: ${droneData.altitude ? `${droneData.altitude}m` : 'N/A'}</p>
              <p>Velocidade: ${droneData.speed ? `${droneData.speed} km/h` : 'N/A'}</p>
              <p>Última atualização: ${new Date(droneData.lastUpdate).toLocaleTimeString('pt-BR')}</p>
            `);
          } else {
            // Criar novo marcador
            const el = document.createElement('div');
            el.className = 'drone-marker';
            el.style.width = '24px';
            el.style.height = '24px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor = getStatusColor(droneData.status);
            el.style.border = '2px solid white';
            el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
            
            const marker = new mapboxgl.Marker(el)
              .setLngLat([droneData.coordinates[0], droneData.coordinates[1]])
              .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <h3 style="font-weight: bold;">${droneData.name || `Drone ${droneId}`}</h3>
                  <p>Status: ${formatStatus(droneData.status)}</p>
                  <p>Bateria: ${droneData.batteryLevel || 'N/A'}%</p>
                  <p>Altitude: ${droneData.altitude ? `${droneData.altitude}m` : 'N/A'}</p>
                  <p>Velocidade: ${droneData.speed ? `${droneData.speed} km/h` : 'N/A'}</p>
                  <p>Última atualização: ${new Date(droneData.lastUpdate).toLocaleTimeString('pt-BR')}</p>
                `))
              .addTo(map);
            
            // Adicionar ao objeto de marcadores
            setMarkers(prev => ({
              ...prev,
              [droneId]: marker
            }));
          }
        }
      });
    }
  }, [activeDrones, map, mapInitialized, markers]);

  // Função para obter cor com base no status
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981'; // green
      case 'flying': return '#3B82F6'; // blue
      case 'maintenance': return '#F59E0B'; // yellow
      case 'charging': return '#8B5CF6'; // purple
      case 'error': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  // Função para formatar status em português
  const formatStatus = (status) => {
    const statusMap = {
      active: 'Ativo',
      inactive: 'Inativo',
      maintenance: 'Manutenção',
      flying: 'Em voo',
      charging: 'Carregando',
      error: 'Erro'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando mapa de drones...</p>
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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mapa de Operações</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Monitoramento em tempo real da frota de drones
        </p>
      </div>
      
      <div id="map" className="h-[500px] w-full"></div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Ativo</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Em voo</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Manutenção</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Carregando</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Erro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
