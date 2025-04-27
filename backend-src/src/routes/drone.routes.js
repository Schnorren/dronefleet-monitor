const express = require('express');
const router = express.Router();
const { protect, authorize, logActivity } = require('../middleware/auth.middleware');

// Controladores (serão implementados posteriormente)
const {
  getDrones,
  getDrone,
  createDrone,
  updateDrone,
  deleteDrone,
  getDroneStats,
  getDroneTelemetry,
  updateDroneStatus,
  scheduleMaintenance
} = require('../controllers/drone.controller');

// Rotas protegidas
router.use(protect);

// Rotas para todos os usuários autenticados
router.get('/', getDrones);
router.get('/:id', getDrone);
router.get('/:id/telemetry', getDroneTelemetry);
router.get('/:id/stats', getDroneStats);

// Rotas apenas para administradores e operadores
router.use(authorize('admin', 'operator'));
router.post('/', logActivity('Criação de drone'), createDrone);
router.put('/:id', logActivity('Atualização de drone'), updateDrone);
router.put('/:id/status', logActivity('Atualização de status de drone'), updateDroneStatus);
router.post('/:id/maintenance', logActivity('Agendamento de manutenção'), scheduleMaintenance);

// Rotas apenas para administradores
router.use(authorize('admin'));
router.delete('/:id', logActivity('Exclusão de drone'), deleteDrone);

module.exports = router;
