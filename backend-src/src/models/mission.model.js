const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da missão é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição da missão é obrigatória']
  },
  drone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drone',
    required: [true, 'Drone é obrigatório']
  },
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'aborted', 'failed'],
    default: 'planned'
  },
  startPoint: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Ponto de partida é obrigatório']
    }
  },
  waypoints: [{
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Coordenadas do waypoint são obrigatórias']
    },
    altitude: {
      type: Number,
      required: [true, 'Altitude do waypoint é obrigatória']
    },
    action: {
      type: String,
      enum: ['flyover', 'hover', 'take_photo', 'record_video', 'scan', 'land', 'takeoff'],
      default: 'flyover'
    },
    duration: {
      type: Number,
      default: 0 // em segundos, para ações como hover
    }
  }],
  restrictedZones: [{
    type: {
      type: String,
      enum: ['Polygon'],
      default: 'Polygon'
    },
    coordinates: {
      type: [[[Number]]],
      required: [true, 'Coordenadas da zona restrita são obrigatórias']
    }
  }],
  plannedStartTime: {
    type: Date,
    required: [true, 'Horário planejado de início é obrigatório']
  },
  plannedEndTime: {
    type: Date,
    required: [true, 'Horário planejado de término é obrigatório']
  },
  actualStartTime: {
    type: Date,
    default: null
  },
  actualEndTime: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  telemetryData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  weather: {
    temperature: Number,
    windSpeed: Number,
    windDirection: String,
    precipitation: Number,
    visibility: Number
  }
}, {
  timestamps: true
});

// Índices para consultas geoespaciais
MissionSchema.index({ startPoint: '2dsphere' });
MissionSchema.index({ 'waypoints.coordinates': '2dsphere' });
MissionSchema.index({ 'restrictedZones.coordinates': '2dsphere' });

// Método para calcular duração estimada da missão
MissionSchema.methods.calculateEstimatedDuration = function() {
  return (this.plannedEndTime - this.plannedStartTime) / (1000 * 60); // em minutos
};

// Método para calcular duração real da missão
MissionSchema.methods.calculateActualDuration = function() {
  if (!this.actualStartTime || !this.actualEndTime) {
    return null;
  }
  return (this.actualEndTime - this.actualStartTime) / (1000 * 60); // em minutos
};

module.exports = mongoose.model('Mission', MissionSchema);
