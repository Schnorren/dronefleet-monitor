const mongoose = require('mongoose');

const DroneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  serialNumber: {
    type: String,
    required: [true, 'Número de série é obrigatório'],
    unique: true,
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Modelo é obrigatório'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive', 'flying', 'charging', 'error'],
    default: 'inactive'
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  nextMaintenance: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setMonth(date.getMonth() + 3); // Manutenção a cada 3 meses por padrão
      return date;
    }
  },
  totalFlightHours: {
    type: Number,
    default: 0
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0] // [longitude, latitude]
    },
    altitude: {
      type: Number,
      default: 0
    }
  },
  maxSpeed: {
    type: Number,
    default: 20 // em m/s
  },
  maxAltitude: {
    type: Number,
    default: 120 // em metros
  },
  maxFlightTime: {
    type: Number,
    default: 30 // em minutos
  },
  sensors: [{
    type: String,
    enum: ['camera', 'thermal', 'lidar', 'multispectral', 'gas', 'radiation']
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índice para consultas geoespaciais
DroneSchema.index({ currentLocation: '2dsphere' });

// Virtual para missões relacionadas a este drone
DroneSchema.virtual('missions', {
  ref: 'Mission',
  localField: '_id',
  foreignField: 'drone',
  justOne: false
});

// Método para calcular status da manutenção
DroneSchema.methods.getMaintenanceStatus = function() {
  const today = new Date();
  const daysUntilMaintenance = Math.ceil((this.nextMaintenance - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilMaintenance < 0) {
    return { status: 'overdue', days: Math.abs(daysUntilMaintenance) };
  } else if (daysUntilMaintenance <= 7) {
    return { status: 'warning', days: daysUntilMaintenance };
  } else {
    return { status: 'ok', days: daysUntilMaintenance };
  }
};

module.exports = mongoose.model('Drone', DroneSchema);
