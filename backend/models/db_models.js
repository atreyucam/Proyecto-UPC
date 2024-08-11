const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// 1. Tabla roles
const Rol = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
}, { tableName: 'Rol' });

// 2. Tabla Persona
const Persona = sequelize.define('Persona', {
  id_persona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cedula: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      isNumeric: true,
    }
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,  // Único
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  disponibilidad: {
    type: DataTypes.ENUM('Disponible', 'Ocupado'),
    allowNull: true, // Permitimos nulo para otros roles
  },
  genero: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'), // O puedes usar DataTypes.STRING si prefieres no restringirlo
    allowNull: true, // Puede ser nulo si no se proporciona
  }

}, { tableName: 'Persona',
  indexes: [
    {
      unique: true,
      fields: ['cedula']
    },
    {
      unique: true,
      fields: ['email']
    }
  ],
  hooks: {
    beforeCreate: async (persona) => {
      const salt = await bcrypt.genSalt(10);
      persona.password = await bcrypt.hash(persona.password, salt);
    },
    beforeUpdate: async (persona) => {
      if (persona.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        persona.password = await bcrypt.hash(persona.password, salt);
      }
    }
  }
});

// 3. Tabla PersonaRol
const PersonaRol = sequelize.define('PersonaRol', {
  id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: Persona,
      key: 'id_persona'
    },
    primaryKey: true
  },
  id_rol: {
    type: DataTypes.INTEGER,
    references: {
      model: Rol,
      key: 'id_rol'
    },
    primaryKey: true
  }
}, { tableName: 'PersonaRol' });

// 4. Circuito
const Circuito = sequelize.define('Circuito', {
  id_circuito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  provincia: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  barrio: {
    type: DataTypes.STRING(50),
    allowNull: false, // Permitimos nulo para casos donde no se puede determinar el barrio
  },
  numero_circuito: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { tableName: 'Circuito' });

// 5. TipoSolicitud
const TipoSolicitud = sequelize.define('TipoSolicitud', {
  id_tipo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, { tableName: 'TipoSolicitud' });

// 6. Subtipo
const Subtipo = sequelize.define('Subtipo', {
  id_subtipo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_tipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoSolicitud,
      key: 'id_tipo'
    }
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, { tableName: 'Subtipo' });

// 7. Estado
const Estado = sequelize.define('Estado', {
  id_estado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, { tableName: 'Estado' });

// 8. Solicitud
const Solicitud = sequelize.define('Solicitud', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_estado: {
    type: DataTypes.INTEGER,
    references: {
      model: Estado,
      key: 'id_estado',
    },
    allowNull: false,
  },
  id_subtipo: {
    type: DataTypes.INTEGER,
    references: {
      model: Subtipo,
      key: 'id_subtipo',
    },
    allowNull: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  puntoGPS: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true, // permitir nulo si el puntoGPS es suficiente
  },
  observacion: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ' '
  },
  id_circuito: {
    type: DataTypes.INTEGER,
    references: {
      model: Circuito,
      key: 'id_circuito'
    },
    allowNull: true // Puede ser nulo si no se asigna a un circuito
  },
  creado_por: { // Nuevo campo
    type: DataTypes.INTEGER,
    references: {
      model: Persona,
      key: 'id_persona'
    },
    allowNull: false
  },
  policia_asignado: { // Nuevo campo
    type: DataTypes.INTEGER,
    references: {
      model: Persona,
      key: 'id_persona'
    },
    allowNull: true // Puede ser nulo si aún no se ha asignado un policía
  }
}, { tableName: 'Solicitud' });

// 9. Evento
const Evento = sequelize.define('Evento', {
  id_evento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  evento: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, { tableName: 'Evento' });

// 10. SolicitudEventoPersona
const SolicitudEventoPersona = sequelize.define('SolicitudEventoPersona', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    references: {
      model: Solicitud,
      key: 'id_solicitud',
    },
    allowNull: false,
    primaryKey: true
  },
  id_evento: {
    type  : DataTypes.INTEGER,
    references: {
      model: Evento,
      key: 'id_evento',
    },
    allowNull: false,
    primaryKey: true
  },
  id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: Persona,
      key: 'id_persona',
    },
    allowNull: false,
    primaryKey: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, { tableName: 'SolicitudEventoPersona' });

// 11. TipoEvidencia
const TipoEvidencia = sequelize.define('TipoEvidencia', {
  id_evidencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  evidencia: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, { tableName: 'TipoEvidencia' });

// 12. SolicitudEvidencia
const SolicitudEvidencia = sequelize.define('SolicitudEvidencia', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    references: {
      model: Solicitud,
      key: 'id_solicitud',
    },
    allowNull: false,
    primaryKey: true
  },
  id_evidencia: {
    type: DataTypes.INTEGER,
    references: {
      model: TipoEvidencia,
      key: 'id_evidencia',
    },
    allowNull: false,
    primaryKey: true
  },
  evidencia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { tableName: 'SolicitudEvidencia' });

// 13. Notificacion
const Notificacion = sequelize.define('Notificacion', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  notificacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, { tableName: 'Notificacion' });

// 14. SolicitudNotificacion
const SolicitudNotificacion = sequelize.define('SolicitudNotificacion', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    references: {
      model: Solicitud,
      key: 'id_solicitud',
    },
    allowNull: false,
    primaryKey: true
  },
  id_notificacion: {
    type: DataTypes.INTEGER,
    references: {
      model: Notificacion,
      key: 'id_notificacion',
    },
    allowNull: false,
    primaryKey: true
  },
}, { tableName: 'SolicitudNotificacion' });

// 15. NotificacionPersona
const NotificacionPersona = sequelize.define('NotificacionPersona', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    references: {
      model: Solicitud,
      key: 'id_solicitud',
    },
    allowNull: false,
    primaryKey: true
  },
  id_notificacion: {
    type: DataTypes.INTEGER,
    references: {
      model: Notificacion,
      key: 'id_notificacion',
    },
    allowNull: false,
    primaryKey: true
  },
  id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: Persona,
      key: 'id_persona',
    },
    allowNull: false,
    primaryKey: true
  },
}, { tableName: 'NotificacionPersona' });

// 16. Observacion
const Observacion = sequelize.define('Observacion', {
  id_observacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_solicitud: {
    type: DataTypes.INTEGER,
    references: {
      model: Solicitud,
      key: 'id_solicitud',
    },
    allowNull: false,
  },
  observacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  id_persona: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { tableName: 'Observacion' });

// Definir Relaciones
// 1. Relacion de personas y roles
Persona.belongsToMany(Rol, { through: PersonaRol, foreignKey: 'id_persona' });
Rol.belongsToMany(Persona, { through: PersonaRol, foreignKey: 'id_rol' });

// 2. Relacion de personas a circuitos
Circuito.hasMany(Persona, { foreignKey: 'id_circuito' });
Persona.belongsTo(Circuito, { foreignKey: 'id_circuito' });

// 3. Relacion de tipos de solicitud a subtipos
TipoSolicitud.hasMany(Subtipo, { foreignKey: 'id_tipo', onDelete: 'CASCADE' });
Subtipo.belongsTo(TipoSolicitud, { foreignKey: 'id_tipo', onDelete: 'CASCADE' });

// 4. Relacion de estados a solicitudes
Estado.hasMany(Solicitud, { foreignKey: 'id_estado' });
Solicitud.belongsTo(Estado, { foreignKey: 'id_estado' });

// Relacion de solicitudes a subtipos
Subtipo.hasMany(Solicitud, { foreignKey: 'id_subtipo' });
Solicitud.belongsTo(Subtipo, { foreignKey: 'id_subtipo' });

// 5. Relacion de solicitudes, eventos y personas
Solicitud.hasMany(SolicitudEventoPersona, { foreignKey: 'id_solicitud' });
Evento.hasMany(SolicitudEventoPersona, { foreignKey: 'id_evento' });
Persona.hasMany(SolicitudEventoPersona, { foreignKey: 'id_persona' });
SolicitudEventoPersona.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
SolicitudEventoPersona.belongsTo(Evento, { foreignKey: 'id_evento' });
SolicitudEventoPersona.belongsTo(Persona, { foreignKey: 'id_persona' });

// 6. Relación entre Solicitud y Evidencia
Solicitud.hasMany(SolicitudEvidencia, { foreignKey: 'id_solicitud' });
TipoEvidencia.hasMany(SolicitudEvidencia, { foreignKey: 'id_evidencia' });
SolicitudEvidencia.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
SolicitudEvidencia.belongsTo(TipoEvidencia, { foreignKey: 'id_evidencia' });

// 7. Relación entre Solicitud y Notificación
Solicitud.hasMany(SolicitudNotificacion, { foreignKey: 'id_solicitud' });
Notificacion.hasMany(SolicitudNotificacion, { foreignKey: 'id_notificacion' });
SolicitudNotificacion.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
SolicitudNotificacion.belongsTo(Notificacion, { foreignKey: 'id_notificacion' });

// 8. Relación entre Notificación y Persona
Solicitud.hasMany(NotificacionPersona, { foreignKey: 'id_solicitud' });
Notificacion.hasMany(NotificacionPersona, { foreignKey: 'id_notificacion' });
Persona.hasMany(NotificacionPersona, { foreignKey: 'id_persona' });
NotificacionPersona.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
NotificacionPersona.belongsTo(Notificacion, { foreignKey: 'id_notificacion' });
NotificacionPersona.belongsTo(Persona, { foreignKey: 'id_persona' });

// 9. Relación entre Solicitud y Observación
Solicitud.hasMany(Observacion, { foreignKey: 'id_solicitud' });
Observacion.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
// Relación entre Observación y Persona
Persona.hasMany(Observacion, { foreignKey: 'id_persona' });
Observacion.belongsTo(Persona, { foreignKey: 'id_persona' });
// Nueva relación entre Solicitud y Circuito
Circuito.hasMany(Solicitud, { foreignKey: 'id_circuito' });
Solicitud.belongsTo(Circuito, { foreignKey: 'id_circuito' });

// Relación entre Solicitud y Persona (creador)
Solicitud.belongsTo(Persona, { foreignKey: 'creado_por', as: 'creador' });
Persona.hasMany(Solicitud, { foreignKey: 'creado_por', as: 'solicitudes_creadas' });

// Relación entre Solicitud y Persona (policía asignado)
Solicitud.belongsTo(Persona, { foreignKey: 'policia_asignado', as: 'policia' });
Persona.hasMany(Solicitud, { foreignKey: 'policia_asignado', as: 'solicitudes_asignadas' });


module.exports = {
  sequelize,
  Rol,
  Persona,
  PersonaRol,
  Circuito,
  TipoSolicitud,
  Subtipo,
  Estado,
  Solicitud,
  Evento,
  SolicitudEventoPersona,
  TipoEvidencia,
  SolicitudEvidencia,
  Notificacion,
  NotificacionPersona,
  SolicitudNotificacion,
  Observacion
};

