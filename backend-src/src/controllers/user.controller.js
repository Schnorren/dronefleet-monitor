const User = require('../models/user.model');
const logger = require('../utils/logger');

// @desc    Obter todos os usuários
// @route   GET /api/users
// @access  Private (admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    logger.error(`Erro ao obter usuários: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter usuários'
    });
  }
};

// @desc    Obter um usuário específico
// @route   GET /api/users/:id
// @access  Private (admin)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Erro ao obter usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter usuário'
    });
  }
};

// @desc    Criar um novo usuário
// @route   POST /api/users
// @access  Private (admin)
exports.createUser = async (req, res) => {
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
      role: role || 'observer'
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Erro ao criar usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário'
    });
  }
};

// @desc    Atualizar um usuário
// @route   PUT /api/users/:id
// @access  Private (admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    // Verificar se o usuário existe
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se o email já está em uso por outro usuário
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }
    }

    // Atualizar usuário
    user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Erro ao atualizar usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário'
    });
  }
};

// @desc    Excluir um usuário
// @route   DELETE /api/users/:id
// @access  Private (admin)
exports.deleteUser = async (req, res) => {
  try {
    // Não permitir que o usuário exclua a si mesmo
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode excluir seu próprio usuário'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Erro ao excluir usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir usuário'
    });
  }
};

// @desc    Obter atividade de um usuário
// @route   GET /api/users/:id/activity
// @access  Private (admin)
exports.getUserActivity = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Implementação simplificada - em um sistema real, isso seria obtido de uma coleção de logs
    res.status(200).json({
      success: true,
      data: {
        lastLogin: user.lastLogin,
        // Outros dados de atividade seriam incluídos aqui
      }
    });
  } catch (error) {
    logger.error(`Erro ao obter atividade do usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter atividade do usuário'
    });
  }
};
