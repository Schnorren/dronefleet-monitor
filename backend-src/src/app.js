const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const { setupWebSockets } = require('./websockets');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const droneRoutes = require('./routes/drone.routes');
const missionRoutes = require('./routes/mission.routes');
const reportRoutes = require('./routes/report.routes');

// Inicializar app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/reports', reportRoutes);

// Rota para verificar status da API
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', timestamp: new Date() });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
  });
});

// Iniciar servidor
const server = app.listen(config.app.port, () => {
  console.log(`Servidor rodando na porta ${config.app.port} em modo ${config.app.env}`);
});

// Configurar WebSockets
setupWebSockets(server);

module.exports = { app, server };
