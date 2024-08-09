// services/authService.js
const jwt = require('jsonwebtoken');
const { Persona, Rol, PersonaRol } = require('../../models/db_models');

exports.getAuthenticatedUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const persona = await Persona.findOne({
      where: { id_persona: decoded.id_persona },
      include: {
        model: Rol,
        through: PersonaRol,
        attributes: ['id_rol', 'descripcion']
      }
    });

    if (!persona) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id_persona: persona.id_persona,
      email: persona.email,
      roles: persona.Rols.map((rol) => rol.id_rol),
    };
  } catch (error) {
    throw new Error('Token no válido');
  }
};
