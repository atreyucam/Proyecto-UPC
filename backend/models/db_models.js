
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

// 1. Tabla Zona
const Zona = sequelize.define('Zona', {
  id_zona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_zona: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, { tableName: 'Zonas' });

//-------------------------------------------------------
// 2. Tabla Subzona
const Subzona = sequelize.define('Subzona', {
  id_subzona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_subzona: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  id_zona: {
    type: DataTypes.INTEGER,
    references: {
      model: Zona,
      key: 'id_zona',
    },
    allowNull: false,
  },
}, { tableName: 'Subzonas' });

//-------------------------------------------------------
// 3. Tabla Canton
const Canton = sequelize.define('Canton', {
  id_canton: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_canton: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  id_subzona: {
    type: DataTypes.INTEGER,
    references: {
      model: Subzona,
      key: 'id_subzona',
    },
    allowNull: false,
  },
}, { tableName: 'Cantones' });

//-------------------------------------------------------
// 4. Tabla Distrito
const Distrito = sequelize.define('Distrito', {
  id_distrito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_distrito: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, { tableName: 'Distritos' });

const DistritoCanton = sequelize.define('DistritoCanton', {
  id_distrito: {
    type: DataTypes.INTEGER,
    references: {
      model: Distrito,
      key: 'id_distrito',
    },
    allowNull: false,
    primaryKey: true,
  },
  id_canton: {
    type: DataTypes.INTEGER,
    references: {
      model: Canton,
      key: 'id_canton',
    },
    allowNull: false,
    primaryKey: true,
  },
}, { tableName: 'DistritoCanton' });

//-------------------------------------------------------
// 5. Tabla Parroquia
const Parroquia = sequelize.define('Parroquia', {
  id_parroquia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_parroquia: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  id_canton: { // Relacionar parroquia con cantón
    type: DataTypes.INTEGER,
    references: {
      model: Canton,
      key: 'id_canton',
    },
    allowNull: false,
  },
  id_distrito: { // Mantener la relación con distrito
    type: DataTypes.INTEGER,
    references: {
      model: Distrito,
      key: 'id_distrito',
    },
    allowNull: false,
  },
}, { tableName: 'Parroquias' });

//-------------------------------------------------------
// 6. Tabla Circuito
const Circuito = sequelize.define('Circuito', {
  id_circuito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_circuito: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  id_parroquia: {
    type: DataTypes.INTEGER,
    references: {
      model: Parroquia,
      key: 'id_parroquia',
    },
    allowNull: false,
  },
  id_distrito: { // Relacionar circuito con distrito
    type: DataTypes.INTEGER,
    references: {
      model: Distrito,
      key: 'id_distrito',
    },
    allowNull: false,
  },
}, { tableName: 'Circuitos' });

//-------------------------------------------------------
// 7. Tabla Subcircuito
const Subcircuito = sequelize.define('Subcircuito', {
  id_subcircuito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_subcircuito: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  id_circuito: {
    type: DataTypes.INTEGER,
    references: {
      model: Circuito,
      key: 'id_circuito',
    },
    allowNull: false,
  },
}, { tableName: 'Subcircuitos' });

//-------------------------------------------------------
// 8. Tabla Rol
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

//-------------------------------------------------------
// 9. Tabla Persona
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
  fecha_nacimiento:{
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
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
    allowNull: true,
  },
  genero: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
    allowNull: true,
  },
  id_subzona:{
    type: DataTypes.INTEGER,
    references:{
      model: Subzona,
      key: 'id_subzona',
    }
  },
  id_canton: {
    type: DataTypes.INTEGER,
    references: {
      model: Canton,
      key: 'id_canton',
    },
    allowNull: false,
  },
  id_parroquia: { // Campo opcional para parroquia
    type: DataTypes.INTEGER,
    references: {
      model: Parroquia,
      key: 'id_parroquia',
    },
    allowNull: true,
  },
}, {
  tableName: 'Persona',
  hooks: {
    beforeCreate: async (persona) => {
      const salt = await bcrypt.genSalt(10);
      persona.password = await bcrypt.hash(persona.password, salt);
    },
    beforeUpdate: async (persona) => {
      if (persona.changed('password') && !persona.password.startsWith("$2a$")) {
        // Solo encripta si la contraseña no está ya encriptada
        const salt = await bcrypt.genSalt(10);
        persona.password = await bcrypt.hash(persona.password, salt);
      }
    }
  }
});

//-------------------------------------------------------
// 10. Tabla PersonaRol
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

//-------------------------------------------------------
// 11. Tabla PersonaCircuito
const PersonaCircuito = sequelize.define('PersonaCircuito', {
  id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: Persona,
      key: 'id_persona',
    },
    allowNull: false,
    primaryKey: true,
  },
  id_circuito: {
    type: DataTypes.INTEGER,
    references: {
      model: Circuito,
      key: 'id_circuito',
    },
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'PersonaCircuito',
});

//-------------------------------------------------------
// 12. Tabla PersonaSubcircuito
const PersonaSubcircuito = sequelize.define('PersonaSubcircuito', {
  id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: Persona,
      key: 'id_persona',
    },
    allowNull: false,
    primaryKey: true,
  },
  id_subcircuito: {
    type: DataTypes.INTEGER,
    references: {
      model: Subcircuito,
      key: 'id_subcircuito',
    },
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'PersonaSubcircuito',
});

//-------------------------------------------------------
// 13. Tabla TipoSolicitud
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

//-------------------------------------------------------
// 14. Tabla Subtipo
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

//-------------------------------------------------------
// 15. Tabla Estado
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

//-------------------------------------------------------
// 16. Tabla Solicitud
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
  id_parroquia: {
    type: DataTypes.INTEGER,
    references: {
      model: Parroquia,
      key: 'id_parroquia',
    },
    allowNull: true, // Puede ser nulo si la solicitud no está asociada directamente a una parroquia
  },
  id_circuito: {
    type: DataTypes.INTEGER,
    references: {
      model: Circuito,
      key: 'id_circuito'
    },
    allowNull: true, // Puede ser nulo si no se asigna a un circuito directamente
  },
  id_subcircuito: {
    type: DataTypes.INTEGER,
    references: {
      model: Subcircuito,
      key: 'id_subcircuito',
    },
    allowNull: true, // Puede ser nulo si la solicitud no está asociada a un subcircuito
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

//-------------------------------------------------------
// 17. Tabla Evento
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

//-------------------------------------------------------
// 18. Tabla SolicitudEventoPersona
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

//-------------------------------------------------------
// 19. Tabla TipoEvidencia
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

//-------------------------------------------------------
// 20. Tabla SolicitudEvidencia
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

//-------------------------------------------------------
// 21. Tabla Notificacion
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

//-------------------------------------------------------
// 22. Tabla SolicitudNotificacion
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

//-------------------------------------------------------
// 23. Tabla NotificacionPersona
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

//-------------------------------------------------------
// 24. Tabla Observacion
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
Zona.hasMany(Subzona, { foreignKey: 'id_zona' });
Subzona.belongsTo(Zona, { foreignKey: 'id_zona' });

// Subzona -> Canton
Subzona.hasMany(Canton, { foreignKey: 'id_subzona' });
Canton.belongsTo(Subzona, { foreignKey: 'id_subzona' });

// Canton -> Parroquia
Canton.hasMany(Parroquia, { foreignKey: 'id_canton' });
Parroquia.belongsTo(Canton, { foreignKey: 'id_canton' });

Parroquia.hasMany(Persona, { foreignKey: 'id_parroquia' });
Persona.belongsTo(Parroquia, { foreignKey: 'id_parroquia' });

// Parroquia -> Distrito
Parroquia.belongsTo(Distrito, { foreignKey: 'id_distrito' });
Distrito.hasMany(Parroquia, { foreignKey: 'id_distrito' });
// Parroquia -> Circuito (relación uno a muchos)
Parroquia.hasMany(Circuito, { foreignKey: 'id_parroquia' });
Circuito.belongsTo(Parroquia, { foreignKey: 'id_parroquia' });
// Persona -> Distrito (Relación Uno a Muchos)
Distrito.hasMany(Persona, { foreignKey: 'id_distrito' });
Persona.belongsTo(Distrito, { foreignKey: 'id_distrito' });


// Distrito -> Circuito
Distrito.hasMany(Circuito, { foreignKey: 'id_distrito' });
Circuito.belongsTo(Distrito, { foreignKey: 'id_distrito' });

// Circuito -> Subcircuito
Circuito.hasMany(Subcircuito, { foreignKey: 'id_circuito' });
Subcircuito.belongsTo(Circuito, { foreignKey: 'id_circuito' });

// Relación muchos a muchos entre Distrito y Canton
Distrito.belongsToMany(Canton, { through: DistritoCanton, foreignKey: 'id_distrito', as: 'cantones' });
Canton.belongsToMany(Distrito, { through: DistritoCanton, foreignKey: 'id_canton', as: 'distritos' });


// Persona -> Canton (asociación de persona a un cantón directamente)
Canton.hasMany(Persona, { foreignKey: 'id_canton' });
Persona.belongsTo(Canton, { foreignKey: 'id_canton' });


// Persona -> Roles (Many-to-Many)
Persona.belongsToMany(Rol, { through: PersonaRol, foreignKey: 'id_persona' });
Rol.belongsToMany(Persona, { through: PersonaRol, foreignKey: 'id_rol' });

// Persona -> Circuito (Many-to-Many)
Persona.belongsToMany(Circuito, { through: PersonaCircuito, foreignKey: 'id_persona', as: 'circuitos' });
Circuito.belongsToMany(Persona, { through: PersonaCircuito, foreignKey: 'id_circuito', as: 'personas' });

// Persona -> Subcircuito (Many-to-Many)
Persona.belongsToMany(Subcircuito, { through: PersonaSubcircuito, foreignKey: 'id_persona', as: 'subcircuitos' });
Subcircuito.belongsToMany(Persona, { through: PersonaSubcircuito, foreignKey: 'id_subcircuito', as: 'personas' });

// Relaciones de Solicitud
// Solicitud -> Estado
Estado.hasMany(Solicitud, { foreignKey: 'id_estado' });
Solicitud.belongsTo(Estado, { foreignKey: 'id_estado' });

// Subtipo -> TipoSolicitud
TipoSolicitud.hasMany(Subtipo, { foreignKey: 'id_tipo' });
Subtipo.belongsTo(TipoSolicitud, { foreignKey: 'id_tipo' });


// Solicitud -> Subtipo
Subtipo.hasMany(Solicitud, { foreignKey: 'id_subtipo' });
Solicitud.belongsTo(Subtipo, { foreignKey: 'id_subtipo' });

// Solicitud -> Parroquia
Parroquia.hasMany(Solicitud, { foreignKey: 'id_parroquia' });
Solicitud.belongsTo(Parroquia, { foreignKey: 'id_parroquia' });

// Solicitud -> Circuito
Circuito.hasMany(Solicitud, { foreignKey: 'id_circuito' });
Solicitud.belongsTo(Circuito, { foreignKey: 'id_circuito' });

// Solicitud -> Subcircuito
Subcircuito.hasMany(Solicitud, { foreignKey: 'id_subcircuito' });
Solicitud.belongsTo(Subcircuito, { foreignKey: 'id_subcircuito' });

// Solicitud -> Persona (creador)
Solicitud.belongsTo(Persona, { foreignKey: 'creado_por', as: 'creador' });
Persona.hasMany(Solicitud, { foreignKey: 'creado_por', as: 'solicitudes_creadas' });

// Solicitud -> Persona (policía asignado)
Solicitud.belongsTo(Persona, { foreignKey: 'policia_asignado', as: 'policia' });
Persona.hasMany(Solicitud, { foreignKey: 'policia_asignado', as: 'solicitudes_asignadas' });

// Relaciones de Solicitud con Evidencia, Notificación, Evento y Observación
// Solicitud -> SolicitudEvidencia
Solicitud.hasMany(SolicitudEvidencia, { foreignKey: 'id_solicitud' });
TipoEvidencia.hasMany(SolicitudEvidencia, { foreignKey: 'id_evidencia' });
SolicitudEvidencia.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
SolicitudEvidencia.belongsTo(TipoEvidencia, { foreignKey: 'id_evidencia' });

// Solicitud -> SolicitudNotificacion
Solicitud.hasMany(SolicitudNotificacion, { foreignKey: 'id_solicitud' });
Notificacion.hasMany(SolicitudNotificacion, { foreignKey: 'id_notificacion' });
SolicitudNotificacion.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
SolicitudNotificacion.belongsTo(Notificacion, { foreignKey: 'id_notificacion' });

// Solicitud -> NotificacionPersona
Solicitud.hasMany(NotificacionPersona, { foreignKey: 'id_solicitud' });
Notificacion.hasMany(NotificacionPersona, { foreignKey: 'id_notificacion' });
Persona.hasMany(NotificacionPersona, { foreignKey: 'id_persona' });
NotificacionPersona.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
NotificacionPersona.belongsTo(Notificacion, { foreignKey: 'id_notificacion' });
NotificacionPersona.belongsTo(Persona, { foreignKey: 'id_persona' });

// Solicitud -> SolicitudEventoPersona
Solicitud.hasMany(SolicitudEventoPersona, { foreignKey: 'id_solicitud' });
Evento.hasMany(SolicitudEventoPersona, { foreignKey: 'id_evento' });
Persona.hasMany(SolicitudEventoPersona, { foreignKey: 'id_persona' });
SolicitudEventoPersona.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });
SolicitudEventoPersona.belongsTo(Evento, { foreignKey: 'id_evento' });
SolicitudEventoPersona.belongsTo(Persona, { foreignKey: 'id_persona' });

// Solicitud -> Observacion
Solicitud.hasMany(Observacion, { foreignKey: 'id_solicitud' });
Observacion.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });

// Observacion -> Persona
Persona.hasMany(Observacion, { foreignKey: 'id_persona' });
Observacion.belongsTo(Persona, { foreignKey: 'id_persona' });

module.exports = {
  sequelize,
  Zona,
  Subzona,
  Canton,
  Distrito,
  DistritoCanton,
  Parroquia,
  Circuito,
  Subcircuito,
  PersonaCircuito,
  PersonaSubcircuito,
  Rol,
  Persona,
  PersonaRol,
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



