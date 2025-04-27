const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(config.db.uri, config.db.options);
    logger.info('Conexão com MongoDB estabelecida com sucesso');
  } catch (error) {
    logger.error(`Erro ao conectar com MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
