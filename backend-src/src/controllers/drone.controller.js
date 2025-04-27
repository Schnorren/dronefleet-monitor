const Drone = require('../models/drone.model');
const Mission = require('../models/mission.model');
const logger = require('../utils/logger');

// @desc    Obter todos os drones
// @route   GET /api/drones
// @access  Private
exports.getDrones = async (req, res) => {
  try {
    // Implementar filtros, paginação e ordenação
    const drones = await Drone.find();

    res.status(200).json({
      success: true,
      count: drones.length,
      data: drones
    });
  } catch (error) {
    logger.error(`Erro ao obter drones: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter drones'
    });
  }
};

// @desc    Obter um drone específico
// @route   GET /api/drones/:id
// @access  Private
exports.getDrone = async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.id);

    if (!drone) {
      return res.status(404).json({
        success: false,
        message: 'Drone não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: drone
    });
  } catch (error) {
    logger.error(`Erro ao obter drone: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter drone'
    });
  }
};

// @desc    Criar um novo drone
// @route   POST /api/drones
// @access  Private (admin, operator)
exports.createDrone = async (req, res) => {
  try {
    // Adicionar usuário que criou o drone
    req.body.createdBy = req.user.id;

    const drone = await Drone.create(req.body);

    res.status(201).json({
      success: true,
      data: drone
    });
  } catch (error) {
    logger.error(`Erro ao criar drone: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar drone'
    });
  }
};

// @desc    Atualizar um drone
// @route   PUT /api/drones/:id
// @access  Private (admin, operator)
exports.updateDrone = async (req, res) => {
  try {
    let drone = await Drone.findById(req.params.id);

    if (!drone) {
      return res.status(404).json({
        success: false,
        message: 'Drone não encontrado'
      });
    }

    drone = await Drone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: drone
    });
  } catch (error) {
    logger.error(`Erro ao atualizar drone: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar drone'
    });
  }
};

// @desc    Excluir um drone
// @route   DELETE /api/drones/:id
// @access  Private (admin)
exports.deleteDrone = async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.id);

    if (!drone) {
      return res.status(404).json({
        success: false,
        message: 'Drone não encontrado'
      });
    }

    // Verificar se há missões associadas a este drone
    const missionCount = await Mission.countDocuments({ drone: req.params.id });
    if (missionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Não é possível excluir o drone. Existem ${missionCount} missões associadas a ele.`
      });
    }

    await drone.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Erro ao excluir drone: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir drone'
    });
  }
};

// @desc    Obter estatísticas de um drone
// @route   GET /api/drones/:id/stats
// @access  Private
exports.getDroneStats = async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.id);

    if (!drone) {
      return res.status(404).json({
        success: false,
        message: 'Drone não encontrado'
      });
    }

    // Obter missões associadas a este drone
    const missions = await Mission.find({ drone: req.params.id });

    // Calcular estatísticas
    const stats = {
      totalMissions: missions.length,
      completedMissions: missions.filter(m => m.status === 'completed').length,
      abortedMissions: missions.filter(m => m.status === 'aborted').length,
      failedMissions: missions.filter(m => m.status === 'failed').length,
      plannedMissions: missions.filter(m => m.status === 'planned').length,
      inProgressMissions: missions.filter(m => m.status === 'in_progress').length,
      totalFlightHours: drone.totalFlightHours,
      maintenanceStatus: drone.getMaintenanceStatus()
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error(`Erro ao obter estatísticas do drone: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas do drone'
    });
  }
};

// @desc    Obter telemetria de um drone
// @route   GET /api/drones/:id/telemetry
// @access  Private
exports.getDroneTelemetry = async (req, res) => {
  try {
    // Implementação simplificada - em um sistema real, isso seria obtido de um serviço de telemetria
    res.status(200).json({
      success: true,
      data: {
        timestamp: new Date(),
        batteryLevel: Math.floor(Math.random() * 100),
        altitude: Math.floor(Math.random() * 120),
        speed: Math.floor(Math.random() * 20),
        coordinates: [
          -46.633308 + (Math.random() - 0.5) * 0.1,
          -23.550520 + (Math.random() - 0.5) * 0.1
        ],
        heading: Math.floor(Math.random() * 360),
        signalStrength: Math.floor(Math.random() * 100),
        temperature: 25 + Math.floor(Math.random() * 10)
      }
    });
  } catch (error) {
    logger.error(`Erro ao obter telemetria do drone: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter telemetria do drone'
    });
  }
};

// @desc    Atualizar status de um drone
// @route   PUT /api/drones/:id/status
// @access  Private (admin, operator)
exports.updateDroneStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça o status'
      });
    }

    const drone = await Drone.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!drone) {
      return res.status(404).json({
        success: false,
        message: 'Drone não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: drone
    });
  } catch (error) {
    logger.error(`Erro ao atualizar status do drone: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status do drone'
    });
  }
};

// @desc    Agendar manutenção para um drone
// @route   POST /api/drones/:id/maintenance
// @access  Private (admin, operator)
exports.scheduleMaintenance = async (req, res) => {
  try {
    const { maintenanceDate, notes } = req.body;

    if (!maintenanceDate) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça a data da manutenção'
      });
    }

    const drone = await Drone.findById(req.params.id);

    if (!drone) {
      return res.status(404).json({
        success: false,
        message: 'Drone não encontrado'
      });
    }

    drone.nextMaintenance = new Date(maintenanceDate);
    drone.status = 'maintenance';
    
    // Aqui poderia ser implementado o registro da manutenção em uma coleção separada
    
    await drone.save();

    res.status(200).json({
      success: true,
      data: drone,
      message: 'Manutenção agendada com sucesso'
    });
  } catch (error) {
    logger.error(`Erro ao agendar manutenção: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao agendar manutenção'
    });
  }
};
