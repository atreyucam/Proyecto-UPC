const { Solicitud, SolicitudEventoPersona, NotificacionPersona, Evento, Estado, Subtipo, Persona, TipoSolicitud, Circuito, Rol, sequelize} = require('../models/db_models');
const { Op } = require('sequelize');

// Crear una nueva solicitud
exports.createSolicitud = async (req, res) => {
  const { id_persona, id_estado, id_subtipo, puntoGPS, direccion, observacion } = req.body;
  const transaction = await sequelize.transaction();

  try {
    // Obtener el circuito de la persona que crea la solicitud
    const persona = await Persona.findByPk(id_persona);
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    const id_circuito = persona.id_circuito;

    const nuevaSolicitud = await Solicitud.create(
      {
        id_estado,
        id_subtipo,
        puntoGPS,
        direccion,
        observacion,
        id_circuito, // Añadimos el id_circuito a la solicitud
      },
      { transaction }
    );

    // Obtener el tipo de evento basado en el subtipo
    const subtipo = await Subtipo.findByPk(id_subtipo, { include: 'TipoSolicitud' });
    let id_evento = null;

    if (subtipo.id_tipo === 1) {
      id_evento = 1; // El usuario ha presionado el botón de seguridad
    } else if (subtipo.id_tipo === 2) {
      id_evento = 2; // El ciudadano ha registrado una denuncia ciudadana
    } else if (subtipo.id_tipo === 3) {
      id_evento = 3; // El ciudadano ha registrado un servicio comunitario
    }

    await SolicitudEventoPersona.create(
      {
        id_solicitud: nuevaSolicitud.id_solicitud,
        id_evento,
        id_persona,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las solicitudes
exports.getAllSolicitudes = async (req, res) => {
    try {
      const solicitudes = await Solicitud.findAll();
      res.status(200).json(solicitudes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getAllSolicitudesPersona = async (req, res) => {
    const { id_persona } = req.query;
  
    try {
      const solicitudes = await Solicitud.findAll({
        include: [
          {
            model: SolicitudEventoPersona,
            include: [
              {
                model: Persona,
                where: { id_persona },
                required: true  // Solo incluye si hay coincidencia
              },
              {
                model: Evento,
                where: { id_evento: [1, 2, 3] }, // Filtrar eventos de creación
                required: true  // Solo incluye si hay coincidencia
              }
            ],
            required: true  // Solo incluye si hay coincidencia
          },
          {
            model: Estado
          },
          {
            model: Subtipo
          }
        ]
      });
  
      res.status(200).json(solicitudes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Obtener una solicitud por ID
exports.getSolicitudById = async (req, res) => {
    const { id } = req.params;
    try {
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      res.status(200).json(solicitud);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// Actualizar una solicitud
exports.updateSolicitud = async (req, res) => {
    const { id } = req.params;
    const { id_estado, id_subtipo, puntoGPS, direccion, observacion } = req.body;
    try {
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
  
      solicitud.id_estado = id_estado;
      solicitud.id_subtipo = id_subtipo;
      solicitud.puntoGPS = puntoGPS;
      solicitud.direccion = direccion;
      solicitud.observacion = observacion;
      await solicitud.save();
  
      res.status(200).json(solicitud);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Eliminar una solicitud
exports.deleteSolicitud = async (req, res) => {
    const { id } = req.params;
    try {
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
  
      await solicitud.destroy();
      res.status(200).json({ message: 'Solicitud eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Asignar un policía a la solicitud
exports.assignPolicia = async (req, res) => {
    const { id } = req.params;
    const { id_persona, id_evento } = req.body;
    try {
      await Solicitud.update(
        { id_estado: 2 },  // En Camino
        { where: { id_solicitud: id } }
      );
  
      await SolicitudEventoPersona.create({
        id_solicitud: id,
        id_evento,
        id_persona
      });
  
      await NotificacionPersona.create({
        id_solicitud: id,
        id_notificacion: 1,  // Suponiendo que el ID 1 es la notificación de "Policía en camino"
        id_persona
      });

      // Actualizar el estado de disponibilidad del policía a 'Ocupado'
    await Persona.update(
      { disponibilidad: 'Ocupado' },
      { where: { id_persona } }
    );
  
      res.status(200).json({ message: 'Policía asignado y notificado. En camino' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Registrar un evento general
exports.registrarEvento = async (req, res) => {
    const { id } = req.params;
    const { id_evento, id_persona } = req.body;
    try {
      // Verificar que la persona, el evento y la solicitud existan
      const solicitud = await Solicitud.findByPk(id);
      const persona = await Persona.findByPk(id_persona);
      const evento = await Evento.findByPk(id_evento);
  
      if (!solicitud || !persona || !evento) {
        return res.status(400).json({ error: 'Solicitud, persona o evento no encontrados' });
      }
  
      await SolicitudEventoPersona.create({
        id_solicitud: id,
        id_evento,
        id_persona
      });
  
      res.status(200).json({ message: 'Evento registrado con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Marcar solicitud como resuelta
exports.resolveSolicitud = async (req, res) => {
    const { id } = req.params;
    const { id_persona, id_evento } = req.body;
    try {
      await Solicitud.update(
        { id_estado: 3 },  // Resuelto
        { where: { id_solicitud: id } }
      );
  
      await SolicitudEventoPersona.create({
        id_solicitud: id,
        id_evento,
        id_persona
      });
  
      await NotificacionPersona.create({
        id_solicitud: id,
        id_notificacion: 2,  // Suponiendo que el ID 2 es la notificación de "Policía llegó y resolvió el caso"
        id_persona
      });

      // Actualizar el estado de disponibilidad del policía a 'Disponible'
    await Persona.update(
      { disponibilidad: 'Disponible' },
      { where: { id_persona } }
    );
  
      res.status(200).json({ message: 'Solicitud resuelta y notificada.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// ---------------------------------------------------------------------------------------------------
// Metodo para frontend

// Obtener toda la información de una solicitud por ID
exports.getSolicitudFullInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const solicitud = await Solicitud.findByPk(id, {
      include: [
        {
          model: Estado,
          attributes: ['id_estado', 'descripcion']
        },
        {
          model: Subtipo,
          attributes: ['id_subtipo', 'descripcion'],
          include: {
            model: TipoSolicitud,
            attributes: ['id_tipo', 'descripcion']
          }
        },
        {
          model: SolicitudEventoPersona,
          include: [
            {
              model: Evento,
              attributes: ['id_evento', 'evento']
            },
            {
              model: Persona,
              attributes: ['id_persona', 'cedula', 'nombres', 'apellidos', 'telefono', 'email'],
              include: {
                model: Circuito,
                attributes: ['provincia', 'ciudad', 'barrio']
              }
            }
          ]
        }
      ]
    });

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.status(200).json(solicitud);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // Traer toda la info de solicitudes
// exports.getAllSolicitudesFullInfo = async (req, res) => {
//   try {
//     const solicitudes = await Solicitud.findAll({
//       include: [
//         {
//           model: Estado,
//           attributes: ['descripcion']
//         },
//         {
//           model: Subtipo,
//           attributes: ['descripcion'],
//           include: {
//             model: TipoSolicitud,
//             attributes: ['descripcion']
//           }
//         }
//       ]
//     });
//     res.status(200).json(solicitudes);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Traer toda la info de solicitudes
exports.getAllSolicitudesFullInfo = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({
      include: [
        {
          model: Estado,
          attributes: ['descripcion']
        },
        {
          model: Subtipo,
          attributes: ['descripcion'],
          include: {
            model: TipoSolicitud,
            attributes: ['descripcion']
          }
        },
        {
          model: Circuito,
          attributes: ['provincia', 'ciudad', 'barrio']
        },
        {
          model: SolicitudEventoPersona,
          include: [
            {
              model: Persona,
              attributes: ['nombres', 'apellidos'],
              include: [
                {
                  model: Rol,
                  where: { descripcion: 'Policia' },
                  attributes: []
                }
              ]
            },
            {
              model: Evento,
              attributes: ['evento']
            }
          ],
          where: { id_evento: [2, 3, 4] } // Solo incluir eventos de asignación y resolución
        }
      ]
    });
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Obtener todos los estados
exports.getAllEstados = async (req, res) => {
  try {
    const estados = await Estado.findAll();
    res.status(200).json(estados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getFilteredSolicitudes = async (req, res) => {
  const { tipo, subtipo, estado, provincia, ciudad, barrio, fechaInicio, fechaFin } = req.query;

  const whereClause = {};
  const includeClause = [
    {
      model: Estado,
      attributes: ['descripcion'],
    },
    {
      model: Subtipo,
      attributes: ['descripcion'],
      include: {
        model: TipoSolicitud,
        attributes: ['descripcion'],
      },
    },
    {
      model: Circuito,
      attributes: ['provincia', 'ciudad', 'barrio']
    },
    {
      model: SolicitudEventoPersona,
      include: [
        {
          model: Persona,
          attributes: ['nombres', 'apellidos'],
          include: [
            {
              model: Rol,
              where: { descripcion: 'Policia' },
              attributes: []
            }
          ]
        },
        {
          model: Evento,
          attributes: ['evento']
        }
      ],
      // where: { id_evento: [2, 3, 4] }, // Solo incluir eventos de asignación y resolución
      required: false
    }
  ];

  if (tipo) {
    includeClause[1].include.where = { id_tipo: tipo };
    // Elimina la condición de subtipo cuando el tipo está presente
    includeClause[1].where = { id_tipo: tipo };
  }
  

  if (subtipo) {
    includeClause[1].where = { id_subtipo: subtipo };
  }

  if (estado) {
    includeClause[0].where = { id_estado: estado };
  }

  if (provincia) {
    includeClause[2].where = { provincia };
  }

  if (ciudad) {
    includeClause[2].where = { ...includeClause[2].where, ciudad };
  }

  if (barrio) {
    includeClause[2].where = { ...includeClause[2].where, barrio };
  }

  // Convertir las fechas a UTC para compararlas correctamente en PostgreSQL
  if (fechaInicio && fechaFin) {
    whereClause.fecha_creacion = {
      [Op.between]: [
        new Date(`${fechaInicio}T00:00:00.000Z`),
        new Date(`${fechaFin}T23:59:59.999Z`)
      ]
    };
  } else if (fechaInicio) {
    whereClause.fecha_creacion = {
      [Op.gte]: new Date(`${fechaInicio}T00:00:00.000Z`)
    };
  } else if (fechaFin) {
    whereClause.fecha_creacion = {
      [Op.lte]: new Date(`${fechaFin}T23:59:59.999Z`)
    };
  }

  try {
    const solicitudes = await Solicitud.findAll({
      where: whereClause,
      include: includeClause
    });

    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
