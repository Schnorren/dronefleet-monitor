const express = require('express');
const router = express.Router();
const { protect, authorize, logActivity } = require('../middleware/auth.middleware');

// Controladores (serão implementados posteriormente)
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserActivity
} = require('../controllers/user.controller');

// Todas as rotas requerem autenticação
router.use(protect);

// Rotas apenas para administradores
router.use(authorize('admin'));
router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/:id/activity', getUserActivity);
router.post('/', logActivity('Criação de usuário'), createUser);
router.put('/:id', logActivity('Atualização de usuário'), updateUser);
router.delete('/:id', logActivity('Exclusão de usuário'), deleteUser);

module.exports = router;
