const express = require('express');
const router = express.Router();
const { protect, authorize, logActivity } = require('../middleware/auth.middleware');

// Controladores (serão implementados posteriormente)
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  googleAuth,
  googleCallback
} = require('../controllers/auth.controller');

// Rotas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Rotas protegidas
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logActivity('Logout'), logout);
router.put('/update-details', logActivity('Atualização de perfil'), updateDetails);
router.put('/update-password', logActivity('Atualização de senha'), updatePassword);

module.exports = router;
