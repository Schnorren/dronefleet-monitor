const winston = require('winston');
const path = require('path');
const config = require('../config/config');

// Definir níveis de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Definir cores para cada nível
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Adicionar cores ao winston
winston.addColors(colors);

// Definir formato de log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Definir transportes (destinos) para os logs
const transports = [
  // Console para todos os logs
  new winston.transports.Console(),
  // Arquivo para logs de erro
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
  }),
  // Arquivo para todos os logs
  new winston.transports.File({ 
    filename: path.join(__dirname, '../../logs/all.log') 
  }),
];

// Criar logger
const logger = winston.createLogger({
  level: config.app.env === 'development' ? 'debug' : 'warn',
  levels,
  format,
  transports,
});

module.exports = logger;
