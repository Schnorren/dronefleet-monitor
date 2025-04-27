'use client';

import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirecionar para login se token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },
  
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  resetPassword: async (resetToken, password) => {
    try {
      const response = await api.put(`/auth/reset-password/${resetToken}`, { password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/update-details', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/update-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

// Serviços de drones
export const droneService = {
  getDrones: async (params = {}) => {
    try {
      const response = await api.get('/drones', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getDrone: async (id) => {
    try {
      const response = await api.get(`/drones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  createDrone: async (droneData) => {
    try {
      const response = await api.post('/drones', droneData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  updateDrone: async (id, droneData) => {
    try {
      const response = await api.put(`/drones/${id}`, droneData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  deleteDrone: async (id) => {
    try {
      const response = await api.delete(`/drones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getDroneStats: async (id) => {
    try {
      const response = await api.get(`/drones/${id}/stats`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getDroneTelemetry: async (id) => {
    try {
      const response = await api.get(`/drones/${id}/telemetry`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  updateDroneStatus: async (id, status) => {
    try {
      const response = await api.put(`/drones/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  scheduleMaintenance: async (id, maintenanceDate, notes) => {
    try {
      const response = await api.post(`/drones/${id}/maintenance`, { maintenanceDate, notes });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

// Serviços de missões
export const missionService = {
  getMissions: async (params = {}) => {
    try {
      const response = await api.get('/missions', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getMission: async (id) => {
    try {
      const response = await api.get(`/missions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  createMission: async (missionData) => {
    try {
      const response = await api.post('/missions', missionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  updateMission: async (id, missionData) => {
    try {
      const response = await api.put(`/missions/${id}`, missionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  deleteMission: async (id) => {
    try {
      const response = await api.delete(`/missions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  startMission: async (id) => {
    try {
      const response = await api.post(`/missions/${id}/start`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  abortMission: async (id) => {
    try {
      const response = await api.post(`/missions/${id}/abort`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  completeMission: async (id) => {
    try {
      const response = await api.post(`/missions/${id}/complete`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getMissionTelemetry: async (id) => {
    try {
      const response = await api.get(`/missions/${id}/telemetry`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  simulateMission: async (missionData) => {
    try {
      const response = await api.post('/missions/simulate', missionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

// Serviços de relatórios
export const reportService = {
  getReports: async () => {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getReport: async (id) => {
    try {
      const response = await api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  generateMissionReport: async (missionId) => {
    try {
      const response = await api.post(`/reports/mission/${missionId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  generateFleetReport: async () => {
    try {
      const response = await api.post('/reports/fleet');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  generateMaintenanceReport: async () => {
    try {
      const response = await api.post('/reports/maintenance');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  deleteReport: async (id) => {
    try {
      const response = await api.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

// Serviços de usuários
export const userService = {
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  getUserActivity: async (id) => {
    try {
      const response = await api.get(`/users/${id}/activity`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

export default api;
