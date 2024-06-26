const { Persona, PersonaRol, sequelize } = require('../models/db_models');

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
// Obtener todas las personas --V
exports.getAllPersona = async (req, res) => {
  try {
    const personas = await Persona.findAll();
    res.status(200).json(personas);
  } catch (error) {
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
