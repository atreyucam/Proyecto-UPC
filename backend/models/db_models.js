const {DataTypes}= require('sequelize');
const {sequelize} = require('../config/database');


// 1. Tabla roles
const Rol = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { tableName: 'Rol' });

// 2. Tabla Persona
const Persona = sequelize.define('Persona', {
  id_persona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cedula: {type: DataTypes.STRING, allowNull: false},
  nombres: {type: DataTypes.STRING, allowNull: false},
  apellidos: {type: DataTypes.STRING, allowNull:false},
  telefono: {type: DataTypes.STRING, allowNull: false},
  email: {type: DataTypes.STRING, allowNull: false},
  password: {type: DataTypes.STRING, allowNull: false},
  estado: {type: DataTypes.STRING, allowNull: false},
  fecha_creacion: {type: DataTypes.DATE, allowNull: false},
  fecha_modificacion: {type: DataTypes.DATE, allowNull: false}
}, { tableName: 'Persona' });

// 3. Tabla asignacion_roles
const AsignacionRol = sequelize.define('AsignacionRol', {
  id_asignacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Persona',
      key: 'id_persona'
    }
  },
  id_rol: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Rol',
      key: 'id_rol'
    }
  },
}, { tableName: 'asignacion_roles' });

// 4. Tabla Zona
const Zona = sequelize.define('Zona', {
  id_zona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  provincia: DataTypes.STRING,
  ciudad: DataTypes.STRING,
  barrio: DataTypes.STRING,
  numeroZona: DataTypes.INTEGER,
}, { tableName: 'Zona' });

// 5. Tabla persona_Zona
const PersonaZona = sequelize.define('PersonaZona', {
  id_zonaAsignacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_zona: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Zona',
      key: 'id_zona'
    }
  },
  id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Persona',
      key: 'id_persona'
    }
  },
  fecha_asignacion: DataTypes.DATE,
  observacion: DataTypes.TEXT,
}, { tableName: 'persona_Zona' });

// 6. Tabla estados
const Estado = sequelize.define('Estado', {
  id_estado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: DataTypes.STRING,
}, { tableName: 'Estado' });

// 7. Tabla tipo_solicitud
const TipoSolicitud = sequelize.define('TipoSolicitud', {
  id_tipo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: DataTypes.STRING,
}, { tableName: 'TipoSolicitud' });

// 8. Tabla solicitudes_registradas
const SolicitudRegistrada = sequelize.define('SolicitudRegistrada', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_tipo: {
    type: DataTypes.INTEGER,
    references: {
      model: 'TipoSolicitud',
      key: 'id_tipo'
    }
  },
  subtipoSolicitud: DataTypes.STRING,
  descripcionSolicitud: DataTypes.TEXT,
  fecha_creacion: DataTypes.DATE,
  fecha_resuelto: DataTypes.DATE,
  id_estado: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Estado',
      key: 'id_estado'
    }
  },
  puntoGPS: DataTypes.STRING,
  direccion: DataTypes.STRING,
  evidencia: DataTypes.STRING,
  id_persona_policia: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Persona',
      key: 'id_persona'
    }
  },
  id_persona_solicitante: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Persona',
      key: 'id_persona'
    }
  },
  observacion_policia: DataTypes.TEXT,
}, { tableName: 'SolicitudRegistrada' });

// 9. Tabla eventos_solicitudes
const EventoSolicitud = sequelize.define('EventoSolicitud', {
  id_evento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_solicitud: {
    type: DataTypes.INTEGER,
    references: {
      model: 'SolicitudRegistrada',
      key: 'id_solicitud'
    }
  },
  tipo_evento: DataTypes.STRING,
  fecha_evento: DataTypes.DATE,
  id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Persona',
      key: 'id_persona'
    }
  },
  accion: DataTypes.STRING,
  observacion: DataTypes.TEXT,
}, { tableName: 'EventoSolicitud' });

// 10. Tabla notificaciones
const Notificacion = sequelize.define('Notificacion', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mensaje: DataTypes.TEXT,
  fecha_envio: DataTypes.DATE,
  tipo: DataTypes.STRING,
}, { tableName: 'Notificacion' });

// 11. Tabla notificaciones_destinatarios
const NotificacionDestinatario = sequelize.define('NotificacionDestinatario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_notificacion: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Notificacion',
      key: 'id_notificacion'
    }
  },
  id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Persona',
      key: 'id_persona'
    }
  },
}, { tableName: 'NotificacionDestinatario' });

// 12. Tabla alertas
const Alerta = sequelize.define('Alerta', {
  id_alerta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fechaAlerta: DataTypes.DATE,
  eventoRegistrado: DataTypes.STRING,
  id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Persona',
      key: 'id_persona'
    }
  },
  id_solicitud: {
    type: DataTypes.INTEGER,
    references: {
      model: 'SolicitudRegistrada',
      key: 'id_solicitud'
    }
  },
  descripcion: DataTypes.TEXT,
  id_estado: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Estado',
      key: 'id_estado'
    }
  },
}, { tableName: 'Alerta' });

// Definir Relaciones
Rol.hasMany(AsignacionRol, { foreignKey: 'id_rol' });
AsignacionRol.belongsTo(Rol, { foreignKey: 'id_rol' });

Persona.hasMany(AsignacionRol, { foreignKey: 'id_persona' });
AsignacionRol.belongsTo(Persona, { foreignKey: 'id_persona' });

Zona.hasMany(PersonaZona, { foreignKey: 'id_zona' });
PersonaZona.belongsTo(Zona, { foreignKey: 'id_zona' });

Persona.hasMany(PersonaZona, { foreignKey: 'id_persona' });
PersonaZona.belongsTo(Persona, { foreignKey: 'id_persona' });

Estado.hasMany(SolicitudRegistrada, { foreignKey: 'id_estado' });
SolicitudRegistrada.belongsTo(Estado, { foreignKey: 'id_estado' });

TipoSolicitud.hasMany(SolicitudRegistrada, { foreignKey: 'id_tipo' });
SolicitudRegistrada.belongsTo(TipoSolicitud, { foreignKey: 'id_tipo' });

Persona.hasMany(SolicitudRegistrada, { foreignKey: 'id_persona_policia', as: 'Policia' });
SolicitudRegistrada.belongsTo(Persona, { foreignKey: 'id_persona_policia', as: 'Policia' });

Persona.hasMany(SolicitudRegistrada, { foreignKey: 'id_persona_solicitante', as: 'Solicitante' });
SolicitudRegistrada.belongsTo(Persona, { foreignKey: 'id_persona_solicitante', as: 'Solicitante' });

SolicitudRegistrada.hasMany(EventoSolicitud, { foreignKey: 'id_solicitud' });
EventoSolicitud.belongsTo(SolicitudRegistrada, { foreignKey: 'id_solicitud' });

Persona.hasMany(EventoSolicitud, { foreignKey: 'id_persona' });
EventoSolicitud.belongsTo(Persona, { foreignKey: 'id_persona' });

Notificacion.hasMany(NotificacionDestinatario, { foreignKey: 'id_notificacion' });
NotificacionDestinatario.belongsTo(Notificacion, { foreignKey: 'id_notificacion' });

Persona.hasMany(NotificacionDestinatario, { foreignKey: 'id_persona' });
NotificacionDestinatario.belongsTo(Persona, { foreignKey: 'id_persona' });

Persona.hasMany(Alerta, { foreignKey: 'id_persona' });
Alerta.belongsTo(Persona, { foreignKey: 'id_persona' });

SolicitudRegistrada.hasMany(Alerta, { foreignKey: 'id_solicitud' });
Alerta.belongsTo(SolicitudRegistrada, { foreignKey: 'id_solicitud' });

Estado.hasMany(Alerta, { foreignKey: 'id_estado' });
Alerta.belongsTo(Estado, { foreignKey: 'id_estado' });

module.exports = {
  Rol,
  Persona,
  AsignacionRol,
  Zona,
  PersonaZona,
  Estado,
  TipoSolicitud,
  SolicitudRegistrada,
  EventoSolicitud,
  Notificacion,
  NotificacionDestinatario,
  Alerta
};
