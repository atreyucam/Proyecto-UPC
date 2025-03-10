const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const {Persona,Rol,Circuito,sequelize,Solicitud, Estado,Subtipo,TipoSolicitud,
  Subcircuito,Parroquia,Distrito,Canton,Subzona,Zona,DistritoCanton,
} = require("../models/db_models");
const { fetchPersonaDataFromESPOCH } = require("./srv_espoch");
const {sendVerificationEmail} = require('./srv_auth');


// 🚀 Función genérica para crear usuarios (ciudadano, admin, policía)
const createUserByRole = async (userData, roleName) => {
  const transaction = await sequelize.transaction();
  try {
    // 🔎 Consultar API de ESPOCH con la cédula
    const espochData = await fetchPersonaDataFromESPOCH(userData.cedula);
    if (!espochData) throw new Error("No se encontraron datos en ESPOCH");

    // 📌 Verificar si la cédula ya está registrada en la base de datos
    const existingUserByCedula = await Persona.findOne({
      where: { cedula: userData.cedula },
      transaction,
    });

    if (existingUserByCedula) {
      throw new Error("La cédula ya está registrada.");
    }

    // 📌 Verificar si el email ya está registrado en la base de datos
    const existingUserByEmail = await Persona.findOne({
      where: { email: userData.email },
      transaction,
    });

    if (existingUserByEmail) {
      throw new Error("El email ya está registrado.");
    }

    // 📌 Verificar datos mínimos (subzona y cantón)
    if (!userData.id_subzona || !userData.id_canton) {
      throw new Error(`${roleName} debe estar asociado a una subzona y un cantón.`);
    }

    // 📌 Validar que el cantón pertenece a la subzona
    const canton = await Canton.findByPk(userData.id_canton, { transaction });
    if (!canton || canton.id_subzona !== userData.id_subzona) {
      throw new Error("El cantón no corresponde a la subzona seleccionada.");
    }

    // 📌 Validar parroquia si se proporciona
    if (userData.id_parroquia) {
      const parroquia = await Parroquia.findByPk(userData.id_parroquia, { transaction });
      if (!parroquia || parroquia.id_canton !== userData.id_canton) {
        throw new Error("La parroquia no corresponde al cantón seleccionado.");
      }
    }

    // 📌 Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 🏗️ Crear la nueva persona usando los datos de ESPOCH
    const newUser = await Persona.create(
      {
        cedula: espochData.pid_valor,
        nombres: espochData.per_nombres,
        apellidos: `${espochData.per_primerApellido} ${espochData.per_segundoApellido}`,
        genero: espochData.gen_nombre,
        telefono: userData.telefono || null, // Solo lo llena si lo envía el usuario
        fecha_nacimiento: espochData.per_fechaNacimiento,
        email: userData.email,
        password: hashedPassword,
        id_subzona: userData.id_subzona,
        id_canton: userData.id_canton,
        id_parroquia: userData.id_parroquia || null,
        disponibilidad: roleName === "Policia" ? "Disponible" : null, // 🔹 Solo policías inician como "Disponible"
      },
      { transaction }
    );

    // 🔎 Obtener rol y asociarlo al usuario
    const rol = await Rol.findOne({ where: { descripcion: roleName }, transaction });

    if (!rol) throw new Error(`Rol '${roleName}' no encontrado`);
    
    // 🔹 Asegurar que la relación de muchos a muchos se usa correctamente
    await newUser.addRoles([rol], { transaction });
    

    await transaction.commit();

    // 📩 Enviar correo después de confirmar la transacción
    try {
      await sendVerificationEmail(newUser.email);
    } catch (emailError) {
      console.error("⚠️ Error al enviar el correo de verificación:", emailError);
      // No se lanza el error porque el usuario ya está registrado, solo logueamos
    }
    return newUser;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


// 🔹 Crear Ciudadano
exports.createCiudadano = async (ciudadanoData) => {
  return await createUserByRole(ciudadanoData, "Ciudadano");
};

// 🔹 Crear Admin
exports.createAdmin = async (adminData) => {
  return await createUserByRole(adminData, "Admin");
};

// 🔹 Crear Policía
exports.createPolicia = async (policiaData) => {
  return await createUserByRole(policiaData, "Policia");
};








// * Funcion que permite traer a todos los Ciudadanos Creados.
exports.getCiudadanos = async () => {
  try {
    const ciudadanos = await Persona.findAll({
      attributes: ["id_persona", "cedula", "nombres", "apellidos", "telefono"],
      include: [
        {
          model: Rol,
          as: "roles", // ✅ Usar alias si está definido en la relación
          where: { descripcion: "Ciudadano" },
          attributes: [], // No traer datos de Rol
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
              model: Distrito,
              as: "distritos", // ✅ Usar alias definido en la relación muchos a muchos
              attributes: ["nombre_distrito"],
              through: { attributes: [] }, // No incluir la tabla intermedia
            },
          ],
        },
        {
          model: Parroquia,
          // ✅ Alias consistente con la relación en el modelo
          attributes: ["nombre_parroquia"],
          include: [
            {
              model: Distrito,
              as: "Distrito", // ✅ Usar alias si la relación lo usa
              attributes: ["nombre_distrito"],
            },
          ],
          required: false, // Permitir que sea opcional
        },
      ],
    });

    // Log para depuración
    console.log("Datos de ciudadanos obtenidos:", JSON.stringify(ciudadanos, null, 2));

    const countCiudadanos = await Persona.count({
      include: [
        {
          model: Rol,
          as: "roles", // ✅ Usar alias
          where: { descripcion: "Ciudadano" },
        },
      ],
    });

    // Mapeo final asegurando que los alias sean correctos
    const formattedCiudadanos = ciudadanos.map((ciudadano) => ({
      id_persona: ciudadano.id_persona,
      cedula: ciudadano.cedula,
      nombres: ciudadano.nombres,
      apellidos: ciudadano.apellidos,
      telefono: ciudadano.telefono,
      nombre_canton: ciudadano.Canton?.nombre_canton || "Sin Cantón",
      nombre_subzona: ciudadano.Canton?.Subzona?.nombre_subzona || "Sin Subzona",
      nombre_zona: ciudadano.Canton?.Subzona?.Zona?.nombre_zona || "Sin Zona",
      nombre_distrito:
        ciudadano.Parroquia?.Distrito?.nombre_distrito || // ✅ Corregido a Parroquia en lugar de Parroquium
        ciudadano.Canton?.distritos?.[0]?.nombre_distrito || "Sin Distrito",
      nombre_parroquia: ciudadano.Parroquia?.nombre_parroquia || "Sin Parroquia",
    }));

    return { countCiudadanos, ciudadanos: formattedCiudadanos };
  } catch (error) {
    console.error("❌ Error al obtener ciudadanos:", error);
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
          as: "roles",
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
          as: "roles",
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
          as: "roles", // ✅ Usa el alias correcto para la relación con Rol
          through: { attributes: [] },
          attributes: ["id_rol", "descripcion"] // Ahora sí devuelve los atributos necesarios
        },
        {
          model: Circuito,
          as: "circuitos", // ✅ Usa el alias correcto para Circuito
          attributes: ["id_circuito", "nombre_circuito"], // Asegura que traes solo lo necesario
          through: { attributes: [] }, // ✅ No incluir la tabla intermedia
        },
      ],
    });

    if (!persona) {
      throw new Error(`Persona con ID ${id} no encontrada`);
    }

    return persona;
  } catch (error) {
    console.error(
      "❌ Error al obtener la persona por ID con sus roles y circuitos:",
      error.message
    );
    throw new Error("Error al obtener la persona con sus relaciones.");
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
        "genero"
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
      genero: ciudadano.genero,
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



exports.obtenerPoliciasDisponibles = async () => {
  try {
      const policias = await Persona.findAll({
          where: {
              solicitudes_activas: { [Op.lt]: 10 } // Menos de 10 solicitudes activas
          },
          include: [
              {
                  model: Rol,
                  as: "roles", // ✅ Usa el alias correcto definido en el ORM
                  where: { descripcion: "Policia" },
                  attributes: ["descripcion"],
                  through: { attributes: [] } // Excluye la tabla intermedia
              },
              {
                  model: Canton,
                  as: "Canton", // ✅ Usa el alias correcto definido en el ORM
                  attributes: ["nombre_canton"],
                  include: [
                      {
                          model: Subzona,
                          as: "Subzona", // ✅ Usa el alias correcto definido en el ORM
                          attributes: ["nombre_subzona"]
                      }
                  ]
              },
              {
                  model: Distrito,
                  as: "Distrito", // ✅ Alias corregido (antes intentamos con distritos)
                  attributes: ["nombre_distrito"]
              }
          ],
          attributes: ["id_persona", "nombres", "apellidos", "telefono", "solicitudes_activas"]
      });

      return policias.map(policia => ({
          id_persona: policia.id_persona,
          nombres: policia.nombres,
          apellidos: policia.apellidos,
          telefono: policia.telefono,
          solicitudes_activas: `${policia.solicitudes_activas}/10`, // ✅ Formato `4/10`
          roles: policia.roles.map(rol => rol.descripcion),
          ubicacion: policia.Distrito || policia.Canton || policia.Canton?.Subzona
    ? {
        distrito: policia.Distrito?.nombre_distrito ?? "Sin Distrito",
        canton: policia.Canton?.nombre_canton ?? "Sin Cantón",
        subzona: policia.Canton?.Subzona?.nombre_subzona ?? "Sin Subzona"
    }
    : { distrito: "Sin Distrito", canton: "Sin Cantón", subzona: "Sin Subzona" }

      }));
  } catch (error) {
      throw new Error("Error al obtener policías disponibles: " + error.message);
  }
};





exports.getPoliciasDisponibles = async () => {
  try {
      // Obtener los policías con disponibilidad "Disponible"
      const policias = await Persona.findAll({
          include: [
              {
                  model: Rol,
                  as: "roles",
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





exports.getCiudadanoUser = async (id_persona) => {
  try {
    const ciudadano = await Persona.findByPk(id_persona, {
      attributes: [
        "id_persona",
        "cedula",
        "nombres",
        "apellidos",
        "telefono",
        "email",
        "genero"
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
      genero: ciudadano.genero,
    };

    return formattedCiudadano;
  } catch (error) {
    throw new Error(
      "Error al obtener la información del ciudadano: " + error.message
    );
  }
};


exports.verificarContrasena = async ({ id_persona, contrasena }) => {
  const persona = await Persona.findByPk(id_persona);
  if (!persona) throw new Error("Usuario no encontrado");

  console.log("🔍 Comparando contraseña:");
  console.log("Contraseña ingresada:", contrasena);
  console.log("Hash almacenado en BD:", persona.password);

  // 🔥 Si el hash sigue siendo $2b$, reemplázalo manualmente
  const hashParaComparar = persona.password.replace("$2b$", "$2a$");

  console.log("Hash usado en comparación:", hashParaComparar);

  const esValida = await bcrypt.compare(contrasena, hashParaComparar);
  console.log("¿Es válida?", esValida); // 🔍 Ver resultado

  return { valida: esValida };
};


exports.actualizarContrasena = async ({ id_persona, nuevaContrasena }) => {
  const persona = await Persona.findByPk(id_persona);
  if (!persona) throw new Error("Usuario no encontrado");

  // ✅ Generar un salt asegurando compatibilidad con hashes existentes ($2a$)
  const salt = await bcrypt.genSalt(10); // Usa 10 rondas como las contraseñas anteriores

  // ✅ Hashear la contraseña con compatibilidad
  let hashedPassword = await bcrypt.hash(nuevaContrasena, salt);
  hashedPassword = hashedPassword.replace("$2b$", "$2a$"); // 🔥 Forzar compatibilidad

  console.log("Hash generado (forzado a $2a$):", hashedPassword);

  // ✅ Guardar el hash en la base de datos
  persona.password = hashedPassword;
  await persona.save();

  // 🔍 **Verificar qué se almacena realmente en la BD**
  const storedPersona = await Persona.findByPk(id_persona);
  console.log("Contraseña almacenada en BD después de actualizar:", storedPersona.password);

  return { mensaje: "Contraseña actualizada correctamente" };
};