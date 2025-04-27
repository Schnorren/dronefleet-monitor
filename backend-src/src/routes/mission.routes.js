const express = require('express');
const router = express.Router();
const { protect, authorize, logActivity } = require('../middleware/auth.middleware');

// Controladores (serão implementados posteriormente)
const {
  getMissions,
  getMission,
  createMission,
  updateMission,
  deleteMission,
  startMission,
  abortMission,
  completeMission,
  getMissionTelemetry,
  simulateMission
} = require('../controllers/mission.controller');

// Rotas protegidas
router.use(protect);

// Rotas para todos os usuários autenticados
router.get('/', getMissions);
router.get('/:id', getMission);
router.get('/:id/telemetry', getMissionTelemetry);

// Rotas apenas para administradores e operadores
router.use(authorize('admin', 'operator'));
router.post('/', logActivity('Criação de missão'), createMission);
router.put('/:id', logActivity('Atualização de missão'), updateMission);
router.post('/:id/start', logActivity('Início de missão'), startMission);
router.post('/:id/abort', logActivity('Aborto de missão'), abortMission);
router.post('/:id/complete', logActivity('Conclusão de missão'), completeMission);
router.post('/simulate', logActivity('Simulação de missão'), simulateMission);

// Rotas apenas para administradores
router.use(authorize('admin'));
router.delete('/:id', logActivity('Exclusão de missão'), deleteMission);

module.exports = router;
