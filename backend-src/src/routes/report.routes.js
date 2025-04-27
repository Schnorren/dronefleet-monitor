const express = require('express');
const router = express.Router();
const { protect, authorize, logActivity } = require('../middleware/auth.middleware');

// Controladores (serão implementados posteriormente)
const {
  generateMissionReport,
  generateFleetReport,
  generateMaintenanceReport,
  getReports,
  getReport,
  deleteReport
} = require('../controllers/report.controller');

// Todas as rotas requerem autenticação
router.use(protect);

// Rotas para todos os usuários autenticados
router.get('/', getReports);
router.get('/:id', getReport);

// Rotas para administradores e operadores
router.use(authorize('admin', 'operator'));
router.post('/mission/:missionId', logActivity('Geração de relatório de missão'), generateMissionReport);
router.post('/fleet', logActivity('Geração de relatório de frota'), generateFleetReport);
router.post('/maintenance', logActivity('Geração de relatório de manutenção'), generateMaintenanceReport);

// Rotas apenas para administradores
router.use(authorize('admin'));
router.delete('/:id', logActivity('Exclusão de relatório'), deleteReport);

module.exports = router;
