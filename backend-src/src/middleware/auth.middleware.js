const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user.model');
const logger = require('../utils/logger');

// Middleware para verificar token JWT
exports.protect = async (req, res, next) => {
  let token;

  // Verificar se o token está no header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar se o token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acesso não autorizado, token não fornecido'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, config.app.jwtSecret);

    // Adicionar usuário ao request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta de usuário desativada'
      });
    }

    next();
  } catch (error) {
    logger.error(`Erro na autenticação: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
};

// Middleware para verificar permissões de usuário
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autorizado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Usuário com papel '${req.user.role}' não tem permissão para acessar este recurso`
      });
    }

    next();
  };
};

// Middleware para registrar atividade do usuário
exports.logActivity = (activity) => {
  return (req, res, next) => {
    if (req.user) {
      logger.info(`Usuário ${req.user.name} (${req.user._id}): ${activity}`);
      // Aqui poderia ser implementado o registro em banco de dados
    }
    next();
  };
};
