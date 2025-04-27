'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Criar contexto de WebSocket
const WebSocketContext = createContext(null);

// Hook personalizado para usar o contexto de WebSocket
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket deve ser usado dentro de um WebSocketProvider');
  }
  return context;
};

// Provedor de WebSocket
export const WebSocketProvider = ({ children }) => {
  const [droneSocket, setDroneSocket] = useState(null);
  const [clientSocket, setClientSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeDrones, setActiveDrones] = useState({});
  const [subscribedDrones, setSubscribedDrones] = useState([]);

  // Inicializar conexão WebSocket
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Conectar ao namespace de clientes
    const clientSocketInstance = io(`${apiUrl}/clients`, {
      auth: {
        token
      }
    });

    // Eventos do socket de cliente
    clientSocketInstance.on('connect', () => {
      console.log('Cliente conectado ao WebSocket');
      setConnected(true);
      
      // Autenticar após conexão
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        clientSocketInstance.emit('authenticate', {
          userId: user.id,
          token
        });
      }
    });

    clientSocketInstance.on('authenticated', (data) => {
      console.log('Cliente autenticado:', data);
    });

    clientSocketInstance.on('disconnect', () => {
      console.log('Cliente desconectado do WebSocket');
      setConnected(false);
    });

    clientSocketInstance.on('drone_update', (data) => {
      setActiveDrones(prev => ({
        ...prev,
        [data.droneId]: {
          ...prev[data.droneId],
          ...data,
          lastUpdate: new Date()
        }
      }));
    });

    clientSocketInstance.on('drone_initial_state', (data) => {
      setActiveDrones(prev => ({
        ...prev,
        [data.droneId]: {
          ...data,
          lastUpdate: new Date()
        }
      }));
    });

    // Salvar instância do socket
    setClientSocket(clientSocketInstance);

    // Limpar ao desmontar
    return () => {
      if (clientSocketInstance) {
        clientSocketInstance.disconnect();
      }
    };
  }, []);

  // Função para inscrever-se para atualizações de um drone
  const subscribeToDrone = (droneId) => {
    if (!clientSocket || !connected) return;
    
    clientSocket.emit('subscribe_drone', { droneId });
    setSubscribedDrones(prev => {
      if (!prev.includes(droneId)) {
        return [...prev, droneId];
      }
      return prev;
    });
  };

  // Função para cancelar inscrição de um drone
  const unsubscribeFromDrone = (droneId) => {
    if (!clientSocket || !connected) return;
    
    clientSocket.emit('unsubscribe_drone', { droneId });
    setSubscribedDrones(prev => prev.filter(id => id !== droneId));
  };

  // Função para enviar comando para um drone
  const sendCommand = (droneId, command, parameters = {}) => {
    if (!clientSocket || !connected) return;
    
    return new Promise((resolve, reject) => {
      clientSocket.emit('send_command', { droneId, command, parameters });
      
      // Configurar um ouvinte temporário para a resposta do comando
      const responseHandler = (response) => {
        clientSocket.off('command_response', responseHandler);
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message));
        }
      };
      
      clientSocket.on('command_response', responseHandler);
      
      // Timeout para evitar espera infinita
      setTimeout(() => {
        clientSocket.off('command_response', responseHandler);
        reject(new Error('Tempo limite excedido ao enviar comando'));
      }, 10000);
    });
  };

  // Valores expostos pelo contexto
  const value = {
    connected,
    activeDrones,
    subscribedDrones,
    subscribeToDrone,
    unsubscribeFromDrone,
    sendCommand
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export default WebSocketContext;
