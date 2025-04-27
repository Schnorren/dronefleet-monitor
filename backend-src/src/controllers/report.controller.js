const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const Mission = require('../models/mission.model');
const Drone = require('../models/drone.model');

// @desc    Gerar relatório de missão
// @route   POST /api/reports/mission/:missionId
// @access  Private (admin, operator)
exports.generateMissionReport = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.missionId)
      .populate('drone', 'name serialNumber model')
      .populate('createdBy', 'name email');

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Missão não encontrada'
      });
    }

    // Implementação simplificada - em um sistema real, isso geraria um PDF ou Excel
    const reportData = {
      id: Date.now().toString(),
      type: 'mission',
      generatedAt: new Date(),
      generatedBy: req.user.id,
      mission: {
        id: mission._id,
        name: mission.name,
        description: mission.description,
        status: mission.status,
        drone: mission.drone,
        createdBy: mission.createdBy,
        plannedStartTime: mission.plannedStartTime,
        plannedEndTime: mission.plannedEndTime,
        actualStartTime: mission.actualStartTime,
        actualEndTime: mission.actualEndTime,
        duration: mission.calculateActualDuration() || mission.calculateEstimatedDuration(),
        waypoints: mission.waypoints.length
      }
    };

    // Simular salvamento do relatório
    const reportDir = path.join(__dirname, '../../public/reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, `mission_report_${reportData.id}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

    res.status(200).json({
      success: true,
      data: {
        id: reportData.id,
        type: reportData.type,
        generatedAt: reportData.generatedAt,
        downloadUrl: `/reports/mission_report_${reportData.id}.json`
      }
    });
  } catch (error) {
    logger.error(`Erro ao gerar relatório de missão: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório de missão'
    });
  }
};

// @desc    Gerar relatório de frota
// @route   POST /api/reports/fleet
// @access  Private (admin, operator)
exports.generateFleetReport = async (req, res) => {
  try {
    const drones = await Drone.find();

    // Calcular estatísticas da frota
    const stats = {
      totalDrones: drones.length,
      activeDrones: drones.filter(d => d.status === 'active').length,
      maintenanceDrones: drones.filter(d => d.status === 'maintenance').length,
      inactiveDrones: drones.filter(d => d.status === 'inactive').length,
      flyingDrones: drones.filter(d => d.status === 'flying').length,
      chargingDrones: drones.filter(d => d.status === 'charging').length,
      errorDrones: drones.filter(d => d.status === 'error').length,
      totalFlightHours: drones.reduce((total, drone) => total + drone.totalFlightHours, 0),
      averageFlightHours: drones.length > 0 
        ? drones.reduce((total, drone) => total + drone.totalFlightHours, 0) / drones.length 
        : 0
    };

    // Implementação simplificada - em um sistema real, isso geraria um PDF ou Excel
    const reportData = {
      id: Date.now().toString(),
      type: 'fleet',
      generatedAt: new Date(),
      generatedBy: req.user.id,
      stats,
      drones: drones.map(drone => ({
        id: drone._id,
        name: drone.name,
        serialNumber: drone.serialNumber,
        model: drone.model,
        status: drone.status,
        batteryLevel: drone.batteryLevel,
        totalFlightHours: drone.totalFlightHours,
        maintenanceStatus: drone.getMaintenanceStatus()
      }))
    };

    // Simular salvamento do relatório
    const reportDir = path.join(__dirname, '../../public/reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, `fleet_report_${reportData.id}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

    res.status(200).json({
      success: true,
      data: {
        id: reportData.id,
        type: reportData.type,
        generatedAt: reportData.generatedAt,
        downloadUrl: `/reports/fleet_report_${reportData.id}.json`
      }
    });
  } catch (error) {
    logger.error(`Erro ao gerar relatório de frota: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório de frota'
    });
  }
};

// @desc    Gerar relatório de manutenção
// @route   POST /api/reports/maintenance
// @access  Private (admin, operator)
exports.generateMaintenanceReport = async (req, res) => {
  try {
    const drones = await Drone.find();

    // Filtrar drones que precisam de manutenção
    const maintenanceDrones = drones.filter(drone => {
      const status = drone.getMaintenanceStatus();
      return status.status === 'warning' || status.status === 'overdue';
    });

    // Implementação simplificada - em um sistema real, isso geraria um PDF ou Excel
    const reportData = {
      id: Date.now().toString(),
      type: 'maintenance',
      generatedAt: new Date(),
      generatedBy: req.user.id,
      stats: {
        totalDrones: drones.length,
        maintenanceDrones: maintenanceDrones.length,
        overdueDrones: maintenanceDrones.filter(d => d.getMaintenanceStatus().status === 'overdue').length,
        warningDrones: maintenanceDrones.filter(d => d.getMaintenanceStatus().status === 'warning').length
      },
      drones: maintenanceDrones.map(drone => ({
        id: drone._id,
        name: drone.name,
        serialNumber: drone.serialNumber,
        model: drone.model,
        status: drone.status,
        lastMaintenance: drone.lastMaintenance,
        nextMaintenance: drone.nextMaintenance,
        maintenanceStatus: drone.getMaintenanceStatus(),
        totalFlightHours: drone.totalFlightHours
      }))
    };

    // Simular salvamento do relatório
    const reportDir = path.join(__dirname, '../../public/reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, `maintenance_report_${reportData.id}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

    res.status(200).json({
      success: true,
      data: {
        id: reportData.id,
        type: reportData.type,
        generatedAt: reportData.generatedAt,
        downloadUrl: `/reports/maintenance_report_${reportData.id}.json`
      }
    });
  } catch (error) {
    logger.error(`Erro ao gerar relatório de manutenção: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório de manutenção'
    });
  }
};

// @desc    Obter todos os relatórios
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    // Implementação simplificada - em um sistema real, isso seria obtido de um banco de dados
    const reportDir = path.join(__dirname, '../../public/reports');
    if (!fs.existsSync(reportDir)) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    const files = fs.readdirSync(reportDir);
    const reports = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(reportDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const report = JSON.parse(fileContent);
        return {
          id: report.id,
          type: report.type,
          generatedAt: report.generatedAt,
          downloadUrl: `/reports/${file}`
        };
      });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    logger.error(`Erro ao obter relatórios: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter relatórios'
    });
  }
};

// @desc    Obter um relatório específico
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res) => {
  try {
    // Implementação simplificada - em um sistema real, isso seria obtido de um banco de dados
    const reportDir = path.join(__dirname, '../../public/reports');
    const files = fs.readdirSync(reportDir);
    
    const reportFile = files.find(file => file.includes(req.params.id));
    
    if (!reportFile) {
      return res.status(404).json({
        success: false,
        message: 'Relatório não encontrado'
      });
    }

    const filePath = path.join(reportDir, reportFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const report = JSON.parse(fileContent);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error(`Erro ao obter relatório: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter relatório'
    });
  }
};

// @desc    Excluir um relatório
// @route   DELETE /api/reports/:id
// @access  Private (admin)
exports.deleteReport = async (req, res) => {
  try {
    // Implementação simplificada - em um sistema real, isso seria excluído de um banco de dados
    const reportDir = path.join(__dirname, '../../public/reports');
    const files = fs.readdirSync(reportDir);
    
    const reportFile = files.find(file => file.includes(req.params.id));
    
    if (!reportFile) {
      return res.status(404).json({
        success: false,
        message: 'Relatório não encontrado'
      });
    }

    const filePath = path.join(reportDir, reportFile);
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Erro ao excluir relatório: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir relatório'
    });
  }
};
