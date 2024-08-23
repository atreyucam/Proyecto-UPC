const { Op } = require("sequelize");
const {
  Persona,
  Rol,
  Circuito,
  sequelize,
  Solicitud,
  Estado,
  Subtipo,
  TipoSolicitud,
  Subcircuito,
  Parroquia,
  Distrito,
  Canton,
  Subzona,
  Zona,
  DistritoCanton,
} = require("../../models/db_models");

// * Funcion que permite la creacion de un Ciudadano.
exports.createCiudadano = async (ciudadanoData) => {
  const transaction = await sequelize.transaction(); // Iniciar transacción

  try {
    // Verificar que se haya proporcionado subzona y cantón
    if (!ciudadanoData.id_subzona || !ciudadanoData.id_canton) {
      throw new Error(
        "Un ciudadano debe estar asociado a una subzona y un cantón."
      );
    }

    // Verificar que el cantón pertenece a la subzona seleccionada
    const canton = await Canton.findByPk(ciudadanoData.id_canton, {
      transaction,
    });
    if (!canton || canton.id_subzona !== ciudadanoData.id_subzona) {
      throw new Error("El cantón no corresponde a la subzona seleccionada.");
    }

    // Si se proporciona un id_parroquia, validar que pertenece al cantón correcto
    if (ciudadanoData.id_parroquia) {
      const parroquia = await Parroquia.findByPk(ciudadanoData.id_parroquia, {
        transaction,
      });
      if (!parroquia || parroquia.id_canton !== ciudadanoData.id_canton) {
        throw new Error("La parroquia no corresponde al cantón seleccionado.");
      }
    }

    // Crear la nueva persona con el rol de Ciudadano
    const persona = await Persona.create(ciudadanoData, { transaction });
    // Encontrar el rol Ciudadano
    const rol = await Rol.findOne({
      where: { descripcion: "Ciudadano" },
      transaction,
    });
    // Asociar el rol de Ciudadano a la persona
    await persona.addRol(rol, { transaction });
    // Confirmar transacción
    await transaction.commit();

    return persona;
  } catch (error) {
    // Deshacer transacción en caso de error
    await transaction.rollback();

    // Manejar errores de unicidad de Sequelize
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path;
      let message = "Error al crear el ciudadano.";

      if (field === "cedula") {
        message = "La cédula ya está registrada.";
      } else if (field === "email") {
        message = "El email ya está registrado.";
      }

      console.log("Error al crear el ciudadano: ", message);
      throw new Error(message);
    }

    console.log("Error al crear el ciudadano: ", error);
    throw error;
  }
};


// * Funcion que permite la creacion de un Admin.
exports.createAdmin = async (adminData) => {
  const transaction = await sequelize.transaction(); // Iniciar transacción

  try {
    let circuito, subcircuito;

    // Verificar que se haya proporcionado subzona, cantón y distrito
    if (!adminData.id_subzona || !adminData.id_canton || !adminData.id_distrito) {
      throw new Error("Un Admin debe estar asociado a una subzona, un cantón y un distrito.");
    }

    // Verificar que el cantón pertenece a la subzona seleccionada
    const canton = await Canton.findOne({
      where: { id_canton: adminData.id_canton },
      transaction,
    });
    if (!canton) {
      throw new Error("Cantón no encontrado.");
    }

    const subzonaCanton = await Canton.findOne({
      where: {
        id_canton: adminData.id_canton,
        id_subzona: adminData.id_subzona,
      },
      transaction,
    });

    if (!subzonaCanton) {
      throw new Error("El cantón no corresponde a la subzona seleccionada.");
    }

    // Verificar que el distrito pertenece al cantón seleccionado
    const distrito = await Distrito.findByPk(adminData.id_distrito, { transaction });
    if (!distrito) {
      throw new Error("Distrito no encontrado.");
    }

    const distritoCanton = await DistritoCanton.findOne({
      where: {
        id_distrito: adminData.id_distrito,
        id_canton: adminData.id_canton,
      },
      transaction,
    });

    if (!distritoCanton) {
      throw new Error("El distrito no corresponde al cantón seleccionado.");
    }

    // Si se proporciona un id_parroquia, validar que pertenece al cantón correcto
    if (adminData.id_parroquia) {
      const parroquia = await Parroquia.findByPk(adminData.id_parroquia, { transaction });
      if (!parroquia || parroquia.id_canton !== adminData.id_canton) {
        throw new Error("La parroquia no corresponde al cantón seleccionado.");
      }
    }

    // Si se selecciona un circuito, validarlo
    if (adminData.id_circuito) {
      circuito = await Circuito.findByPk(adminData.id_circuito, { transaction });
      if (!circuito) {
        throw new Error("Circuito no encontrado");
      }
    }

    // Si se selecciona un subcircuito, validarlo
    if (adminData.id_subcircuito) {
      subcircuito = await Subcircuito.findByPk(adminData.id_subcircuito, { transaction });
      if (!subcircuito) {
        throw new Error("Subcircuito no encontrado");
      }
    }

    // Crear la nueva persona con el rol de Admin
    const persona = await Persona.create(adminData, { transaction });
    // Encontrar el rol Admin
    const rol = await Rol.findOne({ where: { descripcion: "Admin" }, transaction });
    // Asociar el rol de Admin a la persona
    await persona.addRol(rol, { transaction });

    // Asociar circuitos y subcircuitos si corresponden
    if (circuito) {
      await persona.addCircuitos(circuito, { transaction });
    }

    if (subcircuito) {
      await persona.addSubcircuitos(subcircuito, { transaction });
    }

    // Confirmar transacción
    await transaction.commit();

    return persona;
  } catch (error) {
    // Deshacer transacción en caso de error
    await transaction.rollback();

    // Manejar errores de unicidad de Sequelize
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path;
      let message = "Error al crear el administrador.";

      if (field === "cedula") {
        message = "La cédula ya está registrada.";
      } else if (field === "email") {
        message = "El email ya está registrado.";
      }

      console.log("Error al crear el administrador: ", message);
      throw new Error(message);
    }

    console.log("Error al crear el administrador: ", error);
    throw error;
  }
};


// * Funcion que permite la creacion de un Policia.
exports.createPolicia = async (policiaData) => {
  const transaction = await sequelize.transaction(); // Iniciar transacción

  try {
    let circuito, subcircuito;

    // Verificar que se haya proporcionado subzona, cantón y distrito
    if (
      !policiaData.id_subzona ||
      !policiaData.id_canton ||
      !policiaData.id_distrito
    ) {
      throw new Error(
        "Un policía debe estar asociado a una subzona, un cantón y un distrito."
      );
    }

    // Verificar que el cantón pertenece a la subzona seleccionada
    // Verificar que el cantón pertenece a la subzona seleccionada
    const canton = await Canton.findOne({
      where: { id_canton: policiaData.id_canton },
      transaction,
    });
    if (!canton) {
      throw new Error("Cantón no encontrado.");
    }

    const subzonaCanton = await Canton.findOne({
      where: {
        id_canton: policiaData.id_canton,
        id_subzona: policiaData.id_subzona,
      },
      transaction,
    });

    if (!subzonaCanton) {
      throw new Error("El cantón no corresponde a la subzona seleccionada.");
    }

    // Verificar que el distrito pertenece al cantón seleccionado
    const distrito = await Distrito.findByPk(policiaData.id_distrito, {
      transaction,
    });
    if (!distrito) {
      throw new Error("Distrito no encontrado.");
    }

    const distritoCanton = await DistritoCanton.findOne({
      where: {
        id_distrito: policiaData.id_distrito,
        id_canton: policiaData.id_canton,
      },
      transaction,
    });

    if (!distritoCanton) {
      throw new Error("El distrito no corresponde al cantón seleccionado.");
    }

    // Si se proporciona un id_parroquia, validar que pertenece al cantón correcto
    if (policiaData.id_parroquia) {
      const parroquia = await Parroquia.findByPk(policiaData.id_parroquia, {
        transaction,
      });
      if (!parroquia || parroquia.id_canton !== policiaData.id_canton) {
        throw new Error("La parroquia no corresponde al cantón seleccionado.");
      }
    }

    // Si el policía selecciona un circuito, validarlo
    if (policiaData.id_circuito) {
      circuito = await Circuito.findByPk(policiaData.id_circuito, {
        transaction,
      });
      if (!circuito) {
        throw new Error("Circuito no encontrado");
      }
    }

    // Si el policía selecciona un subcircuito, validarlo
    if (policiaData.id_subcircuito) {
      subcircuito = await Subcircuito.findByPk(policiaData.id_subcircuito, {
        transaction,
      });
      if (!subcircuito) {
        throw new Error("Subcircuito no encontrado");
      }
    }

    // Asignar la disponibilidad inicial de Policía
    policiaData.disponibilidad = "Disponible";
    // Crear la nueva persona con el rol de Policía
    const persona = await Persona.create(policiaData, { transaction });
    // Encontrar el rol Policía
    const rol = await Rol.findOne({
      where: { descripcion: "Policia" },
      transaction,
    });
    // Asociar el rol de Policía a la persona
    await persona.addRol(rol, { transaction });

    // Asociar el distrito al policía (Se establece a través de la clave foránea en la creación)
    // Si la relación es directa, el id_distrito ya debería estar establecido en la tabla Persona

    // Asociar circuitos y subcircuitos si corresponden
    if (circuito) {
      await persona.addCircuitos(circuito, { transaction });
    }

    if (subcircuito) {
      await persona.addSubcircuitos(subcircuito, { transaction });
    }

    // Confirmar transacción
    await transaction.commit();

    return persona;
  } catch (error) {
    // Deshacer transacción en caso de error
    await transaction.rollback();

    // Manejar errores de unicidad de Sequelize
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path;
      let message = "Error al crear el policía.";

      if (field === "cedula") {
        message = "La cédula ya está registrada.";
      } else if (field === "email") {
        message = "El email ya está registrado.";
      }

      console.log("Error al crear el policía: ", message);
      throw new Error(message);
    }

    console.log("Error al crear el policía: ", error);
    throw error;
  }
};

// * Funcion que permite traer a todos los Ciudadanos Creados.
exports.getCiudadanos = async () => {
  try {
    const ciudadanos = await Persona.findAll({
      attributes: ["id_persona", "cedula", "nombres", "apellidos", "telefono"],
      include: [
        {
          model: Rol,
          where: { descripcion: "Ciudadano" },
          attributes: [], // Excluye los atributos de Rol de la respuesta final
        },
        {
          model: Canton,
          attributes: ["nombre_canton"],
          include: [
            {
              model: Subzona,
              attributes: ["nombre_subzona"],
              include: [
                {
                  model: Zona,
                  attributes: ["nombre_zona"],
                },
              ],
            },
            {
              model: Distrito, // Añadir distrito directamente en la relación con Canton
              as: "distritos", // Usar alias definido
              attributes: ["nombre_distrito"],
              through: { attributes: [] }, // Para relación muchos a muchos
            },
          ],
        },
        {
          model: Parroquia, // Relaciona Parroquia directamente con Persona
          attributes: ["nombre_parroquia"],
          include: [
            {
              model: Distrito, // Añadir Distrito dentro de Parroquia
              attributes: ["nombre_distrito"],
            },
          ],
          required: false, // Permitir que Parroquia sea opcional en la consulta
        },
      ],
    });

    // Log para depurar
    console.log(
      "Datos de ciudadanos obtenidos:",
      JSON.stringify(ciudadanos, null, 2)
    );

    const countCiudadanos = await Persona.count({
      include: [
        {
          model: Rol,
          where: { descripcion: "Ciudadano" },
        },
      ],
    });

    // Mapeo para devolver solo los campos solicitados
    const formattedCiudadanos = ciudadanos.map((ciudadano) => ({
      id_persona: ciudadano.id_persona,
      cedula: ciudadano.cedula,
      nombres: ciudadano.nombres,
      apellidos: ciudadano.apellidos,
      telefono: ciudadano.telefono,
      nombre_canton: ciudadano.Canton?.nombre_canton || "Sin Cantón",
      nombre_subzona:
        ciudadano.Canton?.Subzona?.nombre_subzona || "Sin Subzona",
      nombre_zona: ciudadano.Canton?.Subzona?.Zona?.nombre_zona || "Sin Zona",
      nombre_distrito:
        ciudadano.Parroquium?.Distrito?.nombre_distrito ||
        ciudadano.Canton?.distritos?.[0]?.nombre_distrito ||
        "Sin Distrito", // Usa Parroquium si existe, de lo contrario usa Canton
      nombre_parroquia:
        ciudadano.Parroquium?.nombre_parroquia || "Sin Parroquia", // Uso correcto de Parroquium
    }));

    return { countCiudadanos, ciudadanos: formattedCiudadanos };
  } catch (error) {
    console.error("Error al obtener ciudadanos:", error);
    throw new Error("Error al obtener ciudadanos");
  }
};

// * Funcion que permite traer a todos los Policias Creados.
exports.getPolicias = async () => {
  try {
    const policias = await Persona.findAll({
      attributes: [
        "id_persona",
        "cedula",
        "nombres",
        "apellidos",
        "telefono",
        "disponibilidad",
      ],
      include: [
        {
          model: Rol,
          where: { descripcion: "Policia" },
          attributes: [], // Excluye los atributos de Rol de la respuesta final
        },
        {
          model: Canton,
          attributes: ["nombre_canton"],
          include: [
            {
              model: Subzona,
              attributes: ["nombre_subzona"],
              include: [
                {
                  model: Zona,
                  attributes: ["nombre_zona"],
                },
              ],
            },
            {
              model: Distrito, // Relación directa con Distrito
              as: "distritos", // Usar alias si es necesario
              attributes: ["nombre_distrito"],
              through: { attributes: [] }, // Para relación muchos a muchos
            },
          ],
        },
        {
          model: Parroquia, // Relaciona Parroquia directamente con Persona
          attributes: ["nombre_parroquia"],
          include: [
            {
              model: Distrito, // Relación directa con Distrito desde Parroquia
              attributes: ["nombre_distrito"],
            },
          ],
          required: false, // Permitir que Parroquia sea opcional en la consulta
        },
      ],
    });

    const countPolicias = await Persona.count({
      include: [
        {
          model: Rol,
          where: { descripcion: "Policia" },
        },
      ],
    });

    // Mapeo para devolver solo los campos solicitados
    const formattedPolicias = policias.map((policia) => ({
      id_persona: policia.id_persona,
      cedula: policia.cedula,
      nombres: policia.nombres,
      apellidos: policia.apellidos,
      telefono: policia.telefono,
      disponibilidad: policia.disponibilidad,
      nombre_canton: policia.Canton?.nombre_canton || "Sin Cantón",
      nombre_subzona: policia.Canton?.Subzona?.nombre_subzona || "Sin Subzona",
      nombre_zona: policia.Canton?.Subzona?.Zona?.nombre_zona || "Sin Zona",
      nombre_distrito:
        policia.Parroquium?.Distrito?.nombre_distrito ||
        policia.Canton?.distritos?.[0]?.nombre_distrito ||
        "Sin Distrito", // Usa Parroquium si existe, de lo contrario usa Canton
      nombre_parroquia: policia.Parroquium?.nombre_parroquia || "Sin Parroquia", // Uso correcto de Parroquium
    }));

    return { countPolicias, policias: formattedPolicias };
  } catch (error) {
    console.log("Error al obtener policías:", error);
    throw new Error("Error al obtener policías");
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
        through: { attributes: [] },
      },
      {
        model: Circuito,
      },
    ],
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
          through: { attributes: [] }, // Elimina los atributos de la tabla intermedia PersonaRol
        },
        {
          model: Circuito, // Incluye la relación directa con Circuito
        },
      ],
    });
    return persona;
  } catch (error) {
    console.error(
      "Error al obtener la persona por ID con sus roles y circuitos:",
      error
    );
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
      include: [Rol], // Incluye los roles actuales
    });

    if (!persona) {
      throw new Error("Persona no encontrada");
    }

    // Actualizar la información de la persona solo si se proporciona en personaData
    const fieldsToUpdate = {};
    [
      "nombres",
      "apellidos",
      "telefono",
      "email",
      "password",
      "disponibilidad",
    ].forEach((field) => {
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
            [Op.in]: personaData.roles,
          },
        },
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
      include: [Rol],
    });
  } catch (error) {
    console.error("Error al actualizar la persona:", error);
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
// * Metodo en funcionamientoexports.getCiudadanos = async () => {

// ! Por revisar
exports.getCiudadanoConSolicitudes = async (id_persona) => {
  try {
    const ciudadano = await Persona.findByPk(id_persona, {
      include: [
        {
          model: Solicitud,
          as: "solicitudes_creadas",
          include: [
            {
              model: Estado,
              attributes: ["descripcion"],
              as: "Estado",
            },
            {
              model: Subtipo,
              attributes: ["descripcion"],
              include: [
                {
                  model: TipoSolicitud,
                  attributes: ["descripcion"],
                  as: "TipoSolicitud",
                },
              ],
              as: "Subtipo",
            },
          ],
          attributes: [
            "id_solicitud",
            "fecha_creacion",
            "puntoGPS",
            "observacion",
          ],
        },
        {
          model: Canton,
          attributes: ["nombre_canton"],
          include: [
            {
              model: Subzona,
              attributes: ["nombre_subzona"],
              include: [
                {
                  model: Zona,
                  attributes: ["nombre_zona"],
                  as: "Zona",
                },
              ],
              as: "Subzona", // Asegurarse de usar el alias correcto aquí
            },
            {
              model: Distrito,
              attributes: ["nombre_distrito"],
              as: "distritos", // Usar el mismo alias que en getCiudadanos
              through: { attributes: [] }, // Para relación muchos a muchos
            },
          ],
          as: "Canton", // Asegúrate de usar el alias correcto
        },
        {
          model: Parroquia,
          attributes: ["nombre_parroquia"],
          include: [
            {
              model: Distrito,
              attributes: ["nombre_distrito"],
              as: "Distrito", // Asegúrate de usar el alias correcto
            },
          ],
          required: false, // Permitir que Parroquia sea opcional
          as: "Parroquium", // Alias correcto para la relación
        },
      ],
      attributes: [
        "id_persona",
        "cedula",
        "nombres",
        "apellidos",
        "telefono",
        "email",
      ],
    });

    if (!ciudadano) {
      throw new Error("El ciudadano especificado no existe.");
    }

    const formattedCiudadano = {
      id_persona: ciudadano.id_persona,
      cedula: ciudadano.cedula,
      nombres: ciudadano.nombres,
      apellidos: ciudadano.apellidos,
      telefono: ciudadano.telefono,
      email: ciudadano.email,
      nombre_distrito: ciudadano.Parroquium?.Distrito?.nombre_distrito ||
        ciudadano.Canton?.distritos?.[0]?.nombre_distrito || "Sin Distrito",
      nombre_canton: ciudadano.Canton?.nombre_canton || "Sin Cantón",
      nombre_subzona: ciudadano.Canton?.Subzona?.nombre_subzona || "Sin Subzona",
      nombre_zona: ciudadano.Canton?.Subzona?.Zona?.nombre_zona || "Sin Zona",
      nombre_parroquia: ciudadano.Parroquium?.nombre_parroquia || "Sin Parroquia",
      solicitudes_creadas: ciudadano.solicitudes_creadas.map((solicitud) => ({
        id_solicitud: solicitud.id_solicitud,
        estado: solicitud.Estado.descripcion,
        subtipo: solicitud.Subtipo.descripcion,
        tipo_solicitud: solicitud.Subtipo.TipoSolicitud.descripcion,
        fecha_creacion: solicitud.fecha_creacion,
        puntoGPS: solicitud.puntoGPS,
        observacion: solicitud.observacion,
      })),
    };

    return formattedCiudadano;
  } catch (error) {
    throw new Error(
      "Error al obtener la información del ciudadano: " + error.message
    );
  }
};


exports.getPoliciaConSolicitudes = async (id_persona) => {
  try {
    // Obtener la información del policía con las solicitudes asignadas
    const policia = await Persona.findByPk(id_persona, {
      include: [
        {
          model: Solicitud,
          as: "solicitudes_asignadas",
          include: [
            {
              model: Estado,
              attributes: ["descripcion"],
              as: "Estado",
            },
            {
              model: Subtipo,
              attributes: ["descripcion"],
              include: [
                {
                  model: TipoSolicitud,
                  attributes: ["descripcion"],
                  as: "TipoSolicitud",
                },
              ],
              as: "Subtipo",
            },
          ],
          attributes: [
            "id_solicitud",
            "fecha_creacion",
            "puntoGPS",
            "observacion",
          ],
        },
        {
          model: Canton,
          attributes: ["nombre_canton"],
          include: [
            {
              model: Subzona,
              attributes: ["nombre_subzona"],
              include: [
                {
                  model: Zona,
                  attributes: ["nombre_zona"],
                  as: "Zona",
                },
              ],
              as: "Subzona",
            },
            {
              model: Distrito,
              attributes: ["nombre_distrito"],
              as: "distritos",
              through: { attributes: [] },
            },
          ],
          as: "Canton",
        },
        {
          model: Parroquia,
          attributes: ["nombre_parroquia"],
          include: [
            {
              model: Distrito,
              attributes: ["nombre_distrito"],
              as: "Distrito",
            },
          ],
          required: false,
          as: "Parroquium",
        },
      ],
      attributes: [
        "id_persona",
        "cedula",
        "nombres",
        "apellidos",
        "telefono",
        "email",
        "disponibilidad",
      ],
    });

    if (!policia) {
      throw new Error("El policía especificado no existe.");
    }

    // Contadores por tipo de solicitud
    const tipoSolicitudContadores = {};

    policia.solicitudes_asignadas.forEach((solicitud) => {
      const tipoDescripcion = solicitud.Subtipo.TipoSolicitud.descripcion;
      if (!tipoSolicitudContadores[tipoDescripcion]) {
        tipoSolicitudContadores[tipoDescripcion] = 0;
      }
      tipoSolicitudContadores[tipoDescripcion]++;
    });

    // Determinar la solicitud más resuelta
    let solicitudMasResuelta = null;
    let maxCount = 0;
    for (const [tipo, count] of Object.entries(tipoSolicitudContadores)) {
      if (count > maxCount) {
        maxCount = count;
        solicitudMasResuelta = tipo;
      }
    }

    // Contar el total de solicitudes asignadas
    const totalSolicitudes = policia.solicitudes_asignadas.length;

    // Mapear la respuesta para que tenga la estructura deseada y ordenar las solicitudes por fecha de creación descendente
    const formattedPolicia = {
      id_persona: policia.id_persona,
      cedula: policia.cedula,
      nombres: policia.nombres,
      apellidos: policia.apellidos,
      telefono: policia.telefono,
      email: policia.email,
      disponibilidad: policia.disponibilidad,
      nombre_distrito: policia.Parroquium?.Distrito?.nombre_distrito ||
        policia.Canton?.distritos?.[0]?.nombre_distrito || "Sin Distrito",
      nombre_canton: policia.Canton?.nombre_canton || "Sin Cantón",
      nombre_subzona: policia.Canton?.Subzona?.nombre_subzona || "Sin Subzona",
      nombre_zona: policia.Canton?.Subzona?.Zona?.nombre_zona || "Sin Zona",
      nombre_parroquia: policia.Parroquium?.nombre_parroquia || "Sin Parroquia",
      resumen_solicitudes_asignadas: tipoSolicitudContadores,
      solicitud_mas_resuelta: solicitudMasResuelta,
      total_solicitudes: totalSolicitudes,
      solicitudes_asignadas: policia.solicitudes_asignadas
        .map((solicitud) => ({
          id_solicitud: solicitud.id_solicitud,
          estado: solicitud.Estado.descripcion,
          subtipo: solicitud.Subtipo.descripcion,
          tipo_solicitud: solicitud.Subtipo.TipoSolicitud.descripcion,
          fecha_creacion: solicitud.fecha_creacion,
          puntoGPS: solicitud.puntoGPS,
          observacion: solicitud.observacion || "N/A",
        }))
        .sort((a, b) => b.fecha_creacion - a.fecha_creacion),
    };

    return formattedPolicia;
  } catch (error) {
    throw new Error(
      "Error al obtener la información del policía: " + error.message
    );
  }
};




exports.getPoliciasDisponibles = async () => {
  try {
      // Obtener los policías con disponibilidad "Disponible"
      const policias = await Persona.findAll({
          include: [
              {
                  model: Rol,
                  where: { descripcion: "Policia" },
                  attributes: [] // Excluye los atributos de Rol de la respuesta final
              },
              {
                  model: Distrito,
                  attributes: ["nombre_distrito"],
                  as: 'Distrito', // Usa el alias correcto si se ha definido en el ORM
                  include: [
                      {
                          model: Canton,
                          attributes: ["nombre_canton"],
                          as: 'cantones', // Usar alias si se ha definido en ORM
                          include: [
                              {
                                  model: Subzona,
                                  attributes: ["nombre_subzona"],
                                  as: 'Subzona' // Usa el alias correcto
                              }
                          ]
                      }
                  ]
              }
          ],
          where: {
              disponibilidad: "Disponible" // Añadir el filtro para disponibilidad
          }
      });

      // Contar el número de policías con disponibilidad "Disponible"
      const countPolicias = await Persona.count({
          include: [
              {
                  model: Rol,
                  where: { descripcion: "Policia" }
              }
          ],
          where: {
              disponibilidad: "Disponible" // Añadir el filtro para disponibilidad
          }
      });

      // Mapear los policías para devolver solo los campos necesarios
      const formattedPolicias = policias.map((policia) => ({
          id_persona: policia.id_persona,
          cedula: policia.cedula,
          nombres: policia.nombres,
          apellidos: policia.apellidos,
          telefono: policia.telefono,
          disponibilidad: policia.disponibilidad,
          nombre_distrito: policia.Distrito?.nombre_distrito || "Sin Distrito",
          nombre_canton: policia.Distrito?.cantones?.[0]?.nombre_canton || "Sin Cantón", // Ajustar acceso a cantones
          nombre_subzona: policia.Distrito?.cantones?.[0]?.Subzona?.nombre_subzona || "Sin Subzona" // Ajustar acceso a subzona
      }));

      return { countPolicias, policias: formattedPolicias };
  } catch (error) {
      console.error("Error al obtener los policías:", error.message);
      throw new Error(error.message);
  }
};
