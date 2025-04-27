'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import DroneCard from '@/components/DroneCard';
import MissionCard from '@/components/MissionCard';

// Dados simulados para o dashboard
const mockStats = [
  { title: 'Drones Ativos', value: 12, trend: { value: 8, isPositive: true } },
  { title: 'Drones em Voo', value: 4, trend: { value: 20, isPositive: true } },
  { title: 'Missões Ativas', value: 6, trend: { value: 12, isPositive: true } },
  { title: 'Horas de Voo (Mês)', value: '324h', trend: { value: 5, isPositive: true } },
];

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
    currentLocation: {
      coordinates: [-46.633308, -23.550520],
      altitude: 120
    }
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
  },
];

const mockMissions = [
  {
    id: '1',
    name: 'Inspeção Perímetro Norte',
    description: 'Inspeção de segurança do perímetro norte da instalação industrial.',
    status: 'in_progress',
    drone: {
      id: '1',
      name: 'Falcon-1'
    },
    plannedStartTime: '2025-04-25T08:00:00',
    plannedEndTime: '2025-04-25T10:00:00',
    actualStartTime: '2025-04-25T08:05:00',
    waypoints: 12
  },
  {
    id: '2',
    name: 'Mapeamento Área Sul',
    description: 'Mapeamento topográfico da área sul para análise de terreno.',
    status: 'planned',
    drone: {
      id: '2',
      name: 'Eagle-2'
    },
    plannedStartTime: '2025-04-26T09:00:00',
    plannedEndTime: '2025-04-26T11:30:00',
    waypoints: 18
  },
  {
    id: '3',
    name: 'Monitoramento Ambiental',
    description: 'Coleta de dados ambientais e monitoramento de fauna na reserva.',
    status: 'completed',
    drone: {
      id: '3',
      name: 'Hawk-3'
    },
    plannedStartTime: '2025-04-24T14:00:00',
    plannedEndTime: '2025-04-24T16:00:00',
    actualStartTime: '2025-04-24T14:10:00',
    actualEndTime: '2025-04-24T15:45:00',
    waypoints: 15
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral da frota de drones e missões ativas</p>
        </div>
        
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {mockStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
            />
          ))}
        </div>
        
        {/* Mapa (placeholder) */}
        <div className="dashboard-card mb-6">
          <h2 className="dashboard-card-header">Mapa de Operações</h2>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Mapa interativo seria exibido aqui (requer integração com Mapbox ou OpenStreetMap)
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Drones Ativos */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Drones Ativos</h2>
              <a href="/drones" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                Ver todos
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {mockDrones.map((drone) => (
                <DroneCard key={drone.id} drone={drone} onClick={() => console.log(`Drone ${drone.id} clicked`)} />
              ))}
            </div>
          </div>
          
          {/* Missões Recentes */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Missões Recentes</h2>
              <a href="/missions" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                Ver todas
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {mockMissions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} onClick={() => console.log(`Mission ${mission.id} clicked`)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
