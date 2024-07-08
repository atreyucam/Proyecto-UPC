const { Persona, PersonaRol, Rol, sequelize, Circuito } = require('../models/db_models');

// Crear una nueva persona --V
exports.createPersona = async (req, res) => {
  const {
    cedula,
    nombres,
    apellidos,
    telefono,
    email,
    password,
    id_circuito,
    roles,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Crear nueva persona
    const nuevaPersona = await Persona.create(
      {
        cedula,
        nombres,
        apellidos,
        telefono,
        email,
        password,
        id_circuito,
        disponibilidad: roles.includes(2) ? 'Disponible' : null  // Si el rol es policía, disponible
      },
      { transaction }
    );

    // Asignar roles a la persona
    for (const rol_id of roles) {
      await PersonaRol.create(
        {
          id_persona: nuevaPersona.id_persona,
          id_rol: rol_id,
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.status(201).json(nuevaPersona);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};


// Obtener una persona por ID --V
exports.getPersonaById = async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id_persona);
    if (persona) {
      res.json(persona);
    } else {
      res.status(404).json({ error: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar una persona --V
exports.updatePersona = async (req, res) => {
  const { id_persona } = req.params;
  const { cedula, nombres, apellidos, telefono, email, password, id_circuito, roles } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Actualizar los datos de la persona
    await Persona.update({
      cedula,
      nombres,
      apellidos,
      telefono,
      email,
      password,
      id_circuito
    }, {
      where: { id_persona },
      transaction
    });

    // Actualizar los roles si se proporcionan
    if (roles && roles.length > 0) {
      await PersonaRol.destroy({ where: { id_persona }, transaction });

      for (const rol_id of roles) {
        await PersonaRol.create({ id_persona, id_rol: rol_id }, { transaction });
      }
    }

    await transaction.commit();
    res.status(200).json({ message: 'Datos de la persona y roles actualizados' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una Persona --V
exports.deletePersona = async (req, res) => {
  const { id_persona } = req.params;

  const transaction = await sequelize.transaction();

  try {
    await Persona.destroy({ where: { id_persona }, transaction });

    await transaction.commit();
    res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};


// Consultas por roles de usuario
// Obtener todas las personas --V
exports.getAllPersona = async (req, res) => {
  try {
    const personas = await Persona.findAll();
    res.status(200).json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener solo ciudadanos
exports.getCiudadanos = async (req, res) => {
  try {
    const ciudadanos = await Persona.findAll({
      include: [
        {
          model: Rol,
          where: { id_rol: 3 }
        },
        {
          model: Circuito
        }
      ]
    });
    res.status(200).json(ciudadanos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener solo policías
exports.getPolicias = async (req, res) => {
  try {
    const policias = await Persona.findAll({
      include: [
        {
          model: Rol,
          where: { id_rol: 2 }
        },
        {
          model: Circuito
        }
      ],
    });
    res.status(200).json(policias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener los detalles de un policía por ID
exports.getPoliciaById = async (req, res) => {
  try {
    const { id } = req.params;
    const policia = await Persona.findByPk(id, {
      include: [
        {
          model: Circuito,
          attributes: ['provincia', 'ciudad', 'barrio']
        },
        {
          model: Rol,
          where: { id_rol: 2 }
        }
      ]
    });

    if (!policia) {
      return res.status(404).json({ error: "Policía no encontrado" });
    }

    res.json(policia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Obtener usuarios que son ciudadanos y policías
exports.getCiudadanosPolicias = async (req, res) => {
  try {
    // Encontrar personas que tengan exactamente dos roles
    const personas = await Persona.findAll({
      include: {
        model: Rol,
        attributes: ['id_rol'],
        through: {
          attributes: []
        }
      }
    });

    // Filtrar personas que tengan exactamente los roles de 'ciudadano' y 'policia'
    const ciudadanosPolicias = personas.filter(persona => {
      const roles = persona.Rols.map(rol => rol.id_rol);
      return roles.length === 2 && roles.includes(2) && roles.includes(3);
    });

    res.status(200).json(ciudadanosPolicias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuarios que son ciudadanos, policías y admin
exports.getAdminCiudadanosPolicias  = async (req, res) => {
  try {
    // Encontrar personas que tengan exactamente dos roles
    const personas = await Persona.findAll({
      include: {
        model: Rol,
        attributes: ['id_rol'],
        through: {
          attributes: []
        }
      }
    });

    // Filtrar personas que tengan exactamente los roles de 'ciudadano' y 'policia'
    const ciudadanosPoliciasAdmin = personas.filter(persona => {
      const roles = persona.Rols.map(rol => rol.id_rol);
      return roles.length === 3 && roles.includes(2) && roles.includes(3) && roles.includes(1);
    });

    res.status(200).json(ciudadanosPoliciasAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};