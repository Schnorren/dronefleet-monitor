const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const config = require('../config/config');
const logger = require('../utils/logger');

// @desc    Registrar um novo usuário
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'observer' // Padrão é observer
    });

    // Gerar token
    const token = jwt.sign({ id: user._id }, config.app.jwtSecret, {
      expiresIn: config.app.jwtExpiresIn
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Erro ao registrar usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário'
    });
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar email e senha
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça email e senha'
      });
    }

    // Verificar se o usuário existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se a senha está correta
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada. Entre em contato com o administrador.'
      });
    }

    // Atualizar último login
    user.lastLogin = Date.now();
    await user.save();

    // Gerar token
    const token = jwt.sign({ id: user._id }, config.app.jwtSecret, {
      expiresIn: config.app.jwtExpiresIn
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Erro ao fazer login: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login'
    });
  }
};

// @desc    Logout de usuário
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // No frontend, o token deve ser removido do armazenamento local
    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    logger.error(`Erro ao fazer logout: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer logout'
    });
  }
};

// @desc    Obter usuário atual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    logger.error(`Erro ao obter perfil do usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter perfil do usuário'
    });
  }
};

// @desc    Esqueci minha senha
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Não há usuário com esse email'
      });
    }

    // Gerar token de redefinição
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Criar URL de redefinição
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    // Enviar email (implementação simplificada)
    logger.info(`URL de redefinição de senha: ${resetUrl}`);

    res.status(200).json({
      success: true,
      message: 'Email enviado'
    });
  } catch (error) {
    logger.error(`Erro ao processar esqueci minha senha: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar esqueci minha senha'
    });
  }
};

// @desc    Redefinir senha
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Implementação simplificada
    res.status(200).json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    logger.error(`Erro ao redefinir senha: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao redefinir senha'
    });
  }
};

// @desc    Atualizar detalhes do usuário
// @route   PUT /api/auth/update-details
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Erro ao atualizar detalhes do usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar detalhes do usuário'
    });
  }
};

// @desc    Atualizar senha
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Verificar senha atual
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Senha atualizada com sucesso'
    });
  } catch (error) {
    logger.error(`Erro ao atualizar senha: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar senha'
    });
  }
};

// @desc    Autenticação Google
// @route   GET /api/auth/google
// @access  Public
exports.googleAuth = async (req, res) => {
  // Implementação simplificada
  res.status(200).json({
    success: true,
    message: 'Redirecionando para autenticação Google'
  });
};

// @desc    Callback Google
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res) => {
  // Implementação simplificada
  res.status(200).json({
    success: true,
    message: 'Autenticação Google realizada com sucesso'
  });
};
