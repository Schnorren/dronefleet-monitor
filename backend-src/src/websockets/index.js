const socketIo = require('socket.io');
const logger = require('../utils/logger');

// Armazenar conexões ativas de drones
const activeDrones = new Map();

const setupWebSockets = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Namespace para telemetria de drones
  const droneNamespace = io.of('/drones');

  droneNamespace.on('connection', (socket) => {
    logger.info(`Nova conexão WebSocket estabelecida: ${socket.id}`);

    // Autenticar conexão do drone
    socket.on('authenticate', (data) => {
      const { droneId, token } = data;
      
      // Aqui seria implementada a verificação do token
      // Por simplicidade, apenas registramos o drone
      
      logger.info(`Drone ${droneId} autenticado`);
      socket.droneId = droneId;
      activeDrones.set(droneId, { 
        socketId: socket.id,
        lastUpdate: new Date(),
        status: 'online',
        data: {}
      });
      
      socket.join(`drone:${droneId}`);
      socket.emit('authenticated', { success: true });
    });

    // Receber atualizações de telemetria
    socket.on('telemetry', (data) => {
      const { droneId } = socket;
      if (!droneId) {
        socket.emit('error', { message: 'Drone não autenticado' });
        return;
      }

      // Atualizar dados do drone
      const droneInfo = activeDrones.get(droneId);
      if (droneInfo) {
        droneInfo.lastUpdate = new Date();
        droneInfo.data = { ...droneInfo.data, ...data };
        activeDrones.set(droneId, droneInfo);
      }

      // Broadcast para todos os clientes interessados neste drone
      droneNamespace.to(`drone:${droneId}`).emit('drone_update', {
        droneId,
        ...data,
        timestamp: new Date()
      });
    });

    // Desconexão
    socket.on('disconnect', () => {
      const { droneId } = socket;
      if (droneId) {
        logger.info(`Drone ${droneId} desconectado`);
        const droneInfo = activeDrones.get(droneId);
        if (droneInfo) {
          droneInfo.status = 'offline';
          droneInfo.lastUpdate = new Date();
          activeDrones.set(droneId, droneInfo);
          
          // Após 5 minutos, remover o drone da lista se continuar offline
          setTimeout(() => {
            const currentInfo = activeDrones.get(droneId);
            if (currentInfo && currentInfo.status === 'offline') {
              activeDrones.delete(droneId);
              logger.info(`Drone ${droneId} removido da lista de ativos`);
            }
          }, 5 * 60 * 1000);
        }
      }
      logger.info(`Conexão WebSocket encerrada: ${socket.id}`);
    });
  });

  // Namespace para clientes web
  const clientNamespace = io.of('/clients');

  clientNamespace.on('connection', (socket) => {
    logger.info(`Nova conexão de cliente web: ${socket.id}`);

    // Autenticar cliente
    socket.on('authenticate', (data) => {
      const { userId, token } = data;
      
      // Aqui seria implementada a verificação do token
      // Por simplicidade, apenas registramos o cliente
      
      logger.info(`Cliente ${userId} autenticado`);
      socket.userId = userId;
      socket.emit('authenticated', { success: true });
    });

    // Inscrever-se para atualizações de um drone específico
    socket.on('subscribe_drone', (data) => {
      const { droneId } = data;
      socket.join(`drone:${droneId}`);
      
      // Enviar dados atuais do drone, se disponíveis
      const droneInfo = activeDrones.get(droneId);
      if (droneInfo) {
        socket.emit('drone_initial_state', {
          droneId,
          ...droneInfo.data,
          status: droneInfo.status,
          lastUpdate: droneInfo.lastUpdate
        });
      }
    });

    // Cancelar inscrição de um drone
    socket.on('unsubscribe_drone', (data) => {
      const { droneId } = data;
      socket.leave(`drone:${droneId}`);
    });

    // Enviar comando para um drone
    socket.on('send_command', (data) => {
      const { droneId, command, parameters } = data;
      
      // Verificar se o drone está online
      const droneInfo = activeDrones.get(droneId);
      if (!droneInfo || droneInfo.status !== 'online') {
        socket.emit('command_response', { 
          success: false, 
          message: 'Drone offline ou não encontrado' 
        });
        return;
      }
      
      // Encaminhar comando para o drone
      droneNamespace.to(`drone:${droneId}`).emit('command', {
        command,
        parameters,
        timestamp: new Date(),
        requestId: Date.now().toString()
      });
      
      socket.emit('command_response', { 
        success: true, 
        message: 'Comando enviado' 
      });
    });

    // Desconexão
    socket.on('disconnect', () => {
      logger.info(`Cliente web desconectado: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { setupWebSockets };
