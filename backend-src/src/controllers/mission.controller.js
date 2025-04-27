const Mission = require('../models/mission.model');
const Drone = require('../models/drone.model');
const logger = require('../utils/logger');

// @desc    Obter todas as missões
// @route   GET /api/missions
// @access  Private
exports.getMissions = async (req, res) => {
  try {
    // Implementar filtros, paginação e ordenação
    const missions = await Mission.find().populate('drone', 'name serialNumber model status');

    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions
    });
  } catch (error) {
    logger.error(`Erro ao obter missões: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter missões'
    });
  }
};

// @desc    Obter uma missão específica
// @route   GET /api/missions/:id
// @access  Private
exports.getMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id).populate('drone', 'name serialNumber model status');

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Missão não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (error) {
    logger.error(`Erro ao obter missão: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter missão'
    });
  }
};

// @desc    Criar uma nova missão
// @route   POST /api/missions
// @access  Private (admin, operator)
exports.createMission = async (req, res) => {
  try {
    // Verificar se o drone existe e está disponível
    const drone = await Drone.findById(req.body.drone);
    
    if (!drone) {
      return res.status(404).json({
        success: false,
        message: 'Drone não encontrado'
      });
    }
    
    if (drone.status === 'maintenance' || drone.status === 'error') {
      return res.status(400).json({
        success: false,
        message: `Drone não está disponível. Status atual: ${drone.status}`
      });
    }

    // Adicionar usuário que criou a missão
    req.body.createdBy = req.user.id;

    const mission = await Mission.create(req.body);

    res.status(201).json({
      success: true,
      data: mission
    });
  } catch (error) {
    logger.error(`Erro ao criar missão: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar missão'
    });
  }
};

// @desc    Atualizar uma missão
// @route   PUT /api/missions/:id
// @access  Private (admin, operator)
exports.updateMission = async (req, res) => {
  try {
    let mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Missão não encontrada'
      });
    }

    // Verificar se a missão já está em andamento ou concluída
    if (mission.status !== 'planned') {
      return res.status(400).json({
        success: false,
        message: `Não é possível atualizar uma missão com status ${mission.status}`
      });
    }

    mission = await Mission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (error) {
    logger.error(`Erro ao atualizar missão: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar missão'
    });
  }
};

// @desc    Excluir uma missão
// @route   DELETE /api/missions/:id
// @access  Private (admin)
exports.deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Missão não encontrada'
      });
    }

    // Verificar se a missão já está em andamento ou concluída
    if (mission.status !== 'planned') {
      return res.status(400).json({
        success: false,
        message: `Não é possível excluir uma missão com status ${mission.status}`
      });
    }

    await mission.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Erro ao excluir missão: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir missão'
    });
  }
};

// @desc    Iniciar uma missão
// @route   POST /api/missions/:id/start
// @access  Private (admin, operator)
exports.startMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Missão não encontrada'
      });
    }

    // Verificar se a missão já está em andamento ou concluída
    if (mission.status !== 'planned') {
      return res.status(400).json({
        success: false,
        message: `Não é possível iniciar uma missão com status ${mission.status}`
      });
    }

    // Verificar se o drone está disponível
    const drone = await Drone.findById(mission.drone);
    
    if (!drone) {
      return res.status(404).json({
        success: false,
        message: 'Drone não encontrado'
      });
    }
    
    if (drone.status === 'flying' || drone.status === 'maintenance' || drone.status === 'error') {
      return res.status(400).json({
        success: false,
        message: `Drone não está disponível. Status atual: ${drone.status}`
      });
    }

    // Atualizar status da missão e do drone
    mission.status = 'in_progress';
    mission.actualStartTime = Date.now();
    await mission.save();

    drone.status = 'flying';
    await drone.save();

    res.status(200).json({
      success: true,
      data: mission,
      message: 'Missão iniciada com sucesso'
    });
  } catch (error) {
    logger.error(`Erro ao iniciar missão: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao iniciar missão'
    });
  }
};

// @desc    Abortar uma missão
// @route   POST /api/missions/:id/abort
// @access  Private (admin, operator)
exports.abortMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Missão não encontrada'
      });
    }

    // Verificar se a missão está em andamento
    if (mission.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: `Não é possível abortar uma missão com status ${mission.status}`
      });
    }

    // Atualizar status da missão e do drone
    mission.status = 'aborted';
    mission.actualEndTime = Date.now();
    await mission.save();

    const drone = await Drone.findById(mission.drone);
    if (drone) {
      drone.status = 'active';
      await drone.save();
    }

    res.status(200).json({
      success: true,
      data: mission,
      message: 'Missão abortada com sucesso'
    });
  } catch (error) {
    logger.error(`Erro ao abortar missão: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao abortar missão'
    });
  }
};

// @desc    Completar uma missão
// @route   POST /api/missions/:id/complete
// @access  Private (admin, operator)
exports.completeMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Missão não encontrada'
      });
    }

    // Verificar se a missão está em andamento
    if (mission.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: `Não é possível completar uma missão com status ${mission.status}`
      });
    }

    // Atualizar status da missão e do drone
    mission.status = 'completed';
    mission.actualEndTime = Date.now();
    await mission.save();

    const drone = await Drone.findById(mission.drone);
    if (drone) {
      drone.status = 'active';
      
      // Atualizar horas de voo do drone
      const flightDurationHours = (mission.actualEndTime - mission.actualStartTime) / (1000 * 60 * 60);
      drone.totalFlightHours += flightDurationHours;
      
      await drone.save();
    }

    res.status(200).json({
      success: true,
      data: mission,
      message: 'Missão completada com sucesso'
    });
  } catch (error) {
    logger.error(`Erro ao completar missão: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao completar missão'
    });
  }
};

// @desc    Obter telemetria de uma missão
// @route   GET /api/missions/:id/telemetry
// @access  Private
exports.getMissionTelemetry = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Missão não encontrada'
      });
    }

    // Implementação simplificada - em um sistema real, isso seria obtido de um serviço de telemetria
    const telemetryData = {
      timestamp: new Date(),
      position: {
        latitude: -23.550520 + (Math.random() - 0.5) * 0.1,
        longitude: -46.633308 + (Math.random() - 0.5) * 0.1,
        altitude: Math.floor(Math.random() * 120)
      },
      speed: Math.floor(Math.random() * 20),
      batteryLevel: Math.floor(Math.random() * 100),
      heading: Math.floor(Math.random() * 360),
      signalStrength: Math.floor(Math.random() * 100),
      waypointProgress: {
        current: Math.floor(Math.random() * mission.waypoints.length),
        total: mission.waypoints.length
      }
    };

    res.status(200).json({
      success: true,
      data: telemetryData
    });
  } catch (error) {
    logger.error(`Erro ao obter telemetria da missão: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter telemetria da missão'
    });
  }
};

// @desc    Simular uma missão
// @route   POST /api/missions/simulate
// @access  Private (admin, operator)
exports.simulateMission = async (req, res) => {
  try {
    // Implementação simplificada - em um sistema real, isso seria um processo mais complexo
    const { waypoints, drone } = req.body;

    if (!waypoints || !Array.isArray(waypoints) || waypoints.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça waypoints válidos'
      });
    }

    // Verificar se o drone existe
    if (drone) {
      const droneExists = await Drone.findById(drone);
      if (!droneExists) {
        return res.status(404).json({
          success: false,
          message: 'Drone não encontrado'
        });
      }
    }

    // Calcular distância total e tempo estimado
    let totalDistance = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const prevPoint = waypoints[i - 1].coordinates;
      const currentPoint = waypoints[i].coordinates;
      
      // Cálculo simplificado da distância euclidiana
      const distance = Math.sqrt(
        Math.pow(currentPoint[0] - prevPoint[0], 2) + 
        Math.pow(currentPoint[1] - prevPoint[1], 2)
      ) * 111000; // Conversão aproximada para metros (1 grau ≈ 111 km)
      
      totalDistance += distance;
    }

    // Assumindo velocidade média de 10 m/s
    const estimatedDuration = totalDistance / 10; // em segundos

    // Simular consumo de bateria (assumindo 1% a cada 2 minutos de voo)
    const batteryConsumption = (estimatedDuration / 120) * 1;

    res.status(200).json({
      success: true,
      data: {
        totalDistance: totalDistance.toFixed(2), // em metros
        estimatedDuration: (estimatedDuration / 60).toFixed(2), // em minutos
        batteryConsumption: batteryConsumption.toFixed(2), // em percentual
        feasible: batteryConsumption < 80, // Missão é viável se consumir menos de 80% da bateria
        waypoints: waypoints.length
      }
    });
  } catch (error) {
    logger.error(`Erro ao simular missão: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao simular missão'
    });
  }
};
