const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

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
    allowNull: false
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
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
}, { tableName: 'Persona' });

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
    allowNull: false
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
    allowNull: false,
  },
  observacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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
    type: DataTypes.INTEGER,
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
  }
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

// 5. Relacion de solicitudes, eventos y personas
Solicitud.hasMany(SolicitudEventoPersona, { foreignKey: 'id_solicitud' });
Evento.hasMany(SolicitudEventoPersona, { foreignKey: 'id_evento' });
Persona.hasMany(SolicitudEventoPersona, { foreignKey: 'id_persona' });
SolicitudEventoPersona.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
SolicitudEventoPersona.belongsTo(Evento, { foreignKey: 'id_evento' });
SolicitudEventoPersona.belongsTo(Persona, { foreignKey: 'id_persona' });

// 7. Relación entre Solicitud y Evidencia
Solicitud.hasMany(SolicitudEvidencia, { foreignKey: 'id_solicitud' });
TipoEvidencia.hasMany(SolicitudEvidencia, { foreignKey: 'id_evidencia' });
SolicitudEvidencia.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
SolicitudEvidencia.belongsTo(TipoEvidencia, { foreignKey: 'id_evidencia' });

// 8. Relación entre Solicitud y Notificación
Solicitud.hasMany(SolicitudNotificacion, { foreignKey: 'id_solicitud' });
Notificacion.hasMany(SolicitudNotificacion, { foreignKey: 'id_notificacion' });
SolicitudNotificacion.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
SolicitudNotificacion.belongsTo(Notificacion, { foreignKey: 'id_notificacion' });

// 9. Relación entre Notificación y Persona
Solicitud.hasMany(NotificacionPersona, { foreignKey: 'id_solicitud' });
Notificacion.hasMany(NotificacionPersona, { foreignKey: 'id_notificacion' });
Persona.hasMany(NotificacionPersona, { foreignKey: 'id_persona' });
NotificacionPersona.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
NotificacionPersona.belongsTo(Notificacion, { foreignKey: 'id_notificacion' });
NotificacionPersona.belongsTo(Persona, { foreignKey: 'id_persona' });

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
  SolicitudNotificacion
};
