const { Op } = require('sequelize');
const { Persona, Rol, Circuito } = require('../../models/db_models');

// * CrearPersonas
/** 
 * * El metodo permite crear a los usuarios por medio de sus diferentes roles.
 * * En roles se debe ingresar el nombre de su rol por ejemplo:
 * * [1]-[superAdmin], [2]-[Admin], [3]-[Policia], [4]-[Ciudadano]
 * * - Si el rol incluye [Policia], establecer disponibilidad a "Disponible" por defecto
 */
// * Metodo en funcionamiento
  exports.createPersona = async (personaData) => {
    if (personaData.roles.includes('Policia')) {
      personaData.disponibilidad = 'Disponible';
    }
  
    const persona = await Persona.create(personaData);
    const roles = await Rol.findAll({
      where: {
        descripcion: {
          [Op.in]: personaData.roles
        }
      }
    });
    await persona.addRols(roles);
  
    return persona;
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

