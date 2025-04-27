const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');

// Importar app
const { app, server } = require('./app');

// Conectar ao banco de dados
connectDB()
  .then(() => {
    // Iniciar servidor
    const PORT = config.app.port;
    server.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT} em modo ${config.app.env}`);
    });
  })
  .catch(err => {
    logger.error(`Erro ao iniciar servidor: ${err.message}`);
    process.exit(1);
  });

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  logger.error(`Erro não tratado: ${err.message}`);
  // Fechar servidor e sair do processo
  server.close(() => process.exit(1));
});
