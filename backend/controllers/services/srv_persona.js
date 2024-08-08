const { Op } = require('sequelize');
const { Persona, Rol, Circuito, sequelize, Solicitud, Estado, Subtipo, TipoSolicitud } = require('../../models/db_models');

// * CrearPersonas
/** 
 * * El metodo permite crear a los usuarios por medio de sus diferentes roles.
 * * En roles se debe ingresar el nombre de su rol por ejemplo:
 * * [1]-[superAdmin], [2]-[Admin], [3]-[Policia], [4]-[Ciudadano]
 * * - Si el rol incluye [Policia], establecer disponibilidad a "Disponible" por defecto
 */
// * Metodo en funcionamiento
exports.createPersona = async (personaData) => {
  const transaction = await sequelize.transaction(); // Iniciar transacción

  try {
    // Ajustar disponibilidad si es necesario
    if (personaData.roles.includes('Policia')) {
      personaData.disponibilidad = 'Disponible';
    }

    // Crear la nueva persona
    const persona = await Persona.create(personaData, { transaction });

    // Encontrar los roles asociados
    const roles = await Rol.findAll({
      where: {
        descripcion: {
          [Op.in]: personaData.roles
        }
      },
      transaction
    });

    // Asociar roles a la persona
    await persona.addRols(roles, { transaction });

    // Confirmar transacción
    await transaction.commit();

    return persona;
  } catch (error) {
    // Deshacer transacción en caso de error
    await transaction.rollback();
    console.log('Error al crear la persona: ', error);
    throw error;
  }
};


// * Obtener todas las personas
// * El metodo regresa todos los usuarios registrados con informacion.
// * Metodo en funcionamiento
exports.getPersonas = async () => {
    return await Persona.findAll({
      include: [
        {
          model: Rol,
          through: {attributes: []}
        },
        {
          model: Circuito,
        }
      ]
    });
  };
  

// * Obtener persona por ID
// * El Metodo regresa la informacion completa de un usuario por su id.
// * Metodo en funcionamiento
exports.getPersonaById = async (id) => {
  try {
    const persona = await Persona.findByPk(id, {
      include: [
        {
          model: Rol,
          through: { attributes: [] } // Elimina los atributos de la tabla intermedia PersonaRol
        },
        {
          model: Circuito // Incluye la relación directa con Circuito
        }
      ]
    });
    return persona;
  } catch (error) {
    console.error('Error al obtener la persona por ID con sus roles y circuitos:', error);
    throw error; // Re-lanzamos el error para que pueda ser manejado por el controlador
  }
};

// * Actualizar persona
// * El metodo permite actualizar los datos de un usuario registrado por id.
// * Metodo en funcionamiento
exports.updatePersona = async (id, personaData) => {
  try {
    // Buscar la persona por su id
    const persona = await Persona.findByPk(id, {
      include: [Rol] // Incluye los roles actuales
    });

    if (!persona) {
      throw new Error('Persona no encontrada');
    }

    // Actualizar la información de la persona solo si se proporciona en personaData
    const fieldsToUpdate = {};
    ['nombres', 'apellidos', 'telefono', 'email', 'password', 'disponibilidad'].forEach(field => {
      if (personaData[field] !== undefined) {
        fieldsToUpdate[field] = personaData[field];
      }
    });

    if (Object.keys(fieldsToUpdate).length > 0) {
      await persona.update(fieldsToUpdate);
    }

    // Si se incluyen roles en los datos de entrada, actualizar los roles de la persona
    if (personaData.roles && Array.isArray(personaData.roles)) {
      const roles = await Rol.findAll({
        where: {
          descripcion: {
            [Op.in]: personaData.roles
          }
        }
      });

      // Usar el método `setRoles` si está disponible
      if (persona.setRoles) {
        await persona.setRoles(roles);
      } else {
        // Alternativamente, podrías usar métodos de asociación manuales
        await persona.removeRols(); // Elimina roles actuales
        await persona.addRols(roles); // Agrega nuevos roles
      }
    }

    // Devolver la persona actualizada con roles incluidos
    return await Persona.findByPk(id, {
      include: [Rol]
    });
  } catch (error) {
    console.error('Error al actualizar la persona:', error);
    throw error;
  }
};

// * Eliminar persona
// * El metodo permite eliminar a un usuario por su id.
// * Metodo en funcionamiento
exports.deletePersona = async (id) => {
  const persona = await Persona.findByPk(id);
  if (persona) {
    await persona.destroy();
    return persona;
  }
  return null;
};


//------------------------------------------------------
// * -- Filtrar ciudadanos --
// * Filtrar ciudadanos por circuito
// * Metodo en funcionamiento
exports.getCiudadanos = async (idCircuito) => {
  const ciudadanos = await Persona.findAll({
    include: [
      {
        model: Rol,
        where: { descripcion: 'Ciudadano' }
      },
      {
        model: Circuito
      }
    ]
  });
  const countCiudadanos = await Persona.count({
    include: [
      {
        model: Rol,
        where: { descripcion: 'Ciudadano' }
      }
    ]
  });
  return { countCiudadanos, ciudadanos };
};

// * -- Filtrar policías --
// * Permite el filtrar policias por circuito
// * Filtro en funcionamiento
exports.getPolicias = async () => {
  try {
    const policias = await Persona.findAll({
      include: [
        {
          model: Rol,
          where: { descripcion: 'Policia' }
        },
        {
          model: Circuito
        }
      ]
    });
    const countPolicias = await Persona.count({
      include: [
        {
          model: Rol,
          where: { descripcion: 'Policia' }
        }
      ]
    });
    return { countPolicias, policias };
  } catch (error) {
    console.log('errro?')
    throw new Error(error.message);
  }
};


// ! Por revisar


exports.getCiudadanoConSolicitudes = async (id_persona) => {
  try {
    // Obtener la información del ciudadano con sus solicitudes asociadas
    const ciudadano = await Persona.findByPk(id_persona, {
      include: [
        {
          model: Solicitud,
          as: 'solicitudes_creadas',
          include: [
            {
              model: Estado,
              attributes: ['descripcion'], // Incluir la descripción del estado
              as: 'Estado'
            },
            {
              model: Subtipo,
              attributes: ['descripcion'], // Incluir la descripción del subtipo
              include: [
                {
                  model: TipoSolicitud,
                  attributes: ['descripcion'], // Incluir la descripción del tipo de solicitud
                  as: 'TipoSolicitud'
                }
              ],
              as: 'Subtipo'
            }
          ],
          attributes: ['id_solicitud', 'fecha_creacion', 'puntoGPS', 'observacion']
        },
        {
          model: Circuito,
          attributes: ['provincia', 'ciudad', 'barrio', 'numero_circuito'], // Incluir la información del circuito
          as: 'Circuito'
        }
      ]
    });

    if (!ciudadano) {
      throw new Error('El ciudadano especificado no existe.');
    }

    // Mapear la respuesta para que tenga la estructura deseada y ordenar las solicitudes por fecha de creación descendente
    const formattedCiudadano = {
      id_persona: ciudadano.id_persona,
      cedula: ciudadano.cedula,
      nombres: ciudadano.nombres,
      apellidos: ciudadano.apellidos,
      telefono: ciudadano.telefono,
      email: ciudadano.email,
      Circuito: ciudadano.Circuito, // Información del circuito del ciudadano
      solicitudes_creadas: ciudadano.solicitudes_creadas
        .map(solicitud => ({
          id_solicitud: solicitud.id_solicitud,
          estado: solicitud.Estado.descripcion, // Reemplazar id_estado por descripcion
          subtipo: solicitud.Subtipo.descripcion, // Reemplazar id_subtipo por descripcion
          tipo_solicitud: solicitud.Subtipo.TipoSolicitud.descripcion, // Incluir la descripción del tipo de solicitud
          fecha_creacion: solicitud.fecha_creacion,
          puntoGPS: solicitud.puntoGPS,
        }))

    };

    return formattedCiudadano;
  } catch (error) {
    throw new Error('Error al obtener la información del ciudadano: ' + error.message);
  }
};



exports.getPoliciaConSolicitudes = async (id_persona) => {
  try {
    // Obtener la información del policía con las solicitudes asignadas
    const policia = await Persona.findByPk(id_persona, {
      include: [
        {
          model: Solicitud,
          as: 'solicitudes_asignadas',
          include: [
            {
              model: Estado,
              attributes: ['descripcion'], // Incluir la descripción del estado
              as: 'Estado'
            },
            {
              model: Subtipo,
              attributes: ['descripcion'], // Incluir la descripción del subtipo
              include: [
                {
                  model: TipoSolicitud,
                  attributes: ['descripcion'], // Incluir la descripción del tipo de solicitud
                  as: 'TipoSolicitud'
                }
              ],
              as: 'Subtipo'
            }
          ],
          attributes: ['id_solicitud', 'fecha_creacion', 'puntoGPS', 'observacion']
        }
      ]
    });

    if (!policia) {
      throw new Error('El policía especificado no existe.');
    }

    // Mapear la respuesta para que tenga la estructura deseada y ordenar las solicitudes por fecha de creación descendente
    const formattedPolicia = {
      id_persona: policia.id_persona,
      cedula: policia.cedula,
      nombres: policia.nombres,
      apellidos: policia.apellidos,
      telefono: policia.telefono,
      email: policia.email,
      disponibilidad: policia.disponibilidad,
      id_circuito: policia.id_circuito,
      solicitudes_asignadas: policia.solicitudes_asignadas
        .map(solicitud => ({
          id_solicitud: solicitud.id_solicitud,
          estado: solicitud.Estado.descripcion, // Reemplazar id_estado por descripcion
          subtipo: solicitud.Subtipo.descripcion, // Reemplazar id_subtipo por descripcion
          tipo_solicitud: solicitud.Subtipo.TipoSolicitud.descripcion, // Incluir la descripción del tipo de solicitud
          fecha_creacion: solicitud.fecha_creacion,
          puntoGPS: solicitud.puntoGPS,
          observacion: solicitud.observacion || "N/A" // Añadir un valor por defecto si observacion es null
        }))
        .sort((a, b) => b.fecha_creacion - a.fecha_creacion) // Ordenar por fecha de creación en orden descendente
    };

    return formattedPolicia;
  } catch (error) {
    throw new Error('Error al obtener la información del policía: ' + error.message);
  }
};



