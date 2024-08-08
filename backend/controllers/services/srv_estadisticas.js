const { Op, fn, col, literal } = require('sequelize');
const { Persona, Rol, PersonaRol, Circuito, sequelize, Solicitud, Estado, Subtipo, TipoSolicitud } = require('../../models/db_models');
// Datos para estadisticas


// Función para obtener contadores de policías
exports.getPoliciaCounts = async () => {
    try {
      // Obtener la cantidad total de policías
      const totalPolicias = await Persona.count({
        include: [
          {
            model: Rol,
            through: { attributes: [] }, // No incluir atributos de la tabla intermedia
            where: { id_rol: 3 }
          }
        ]
      });
  
      // Obtener la cantidad de policías disponibles
      const disponibles = await Persona.count({
        include: [
          {
            model: Rol,
            through: { attributes: [] }, // No incluir atributos de la tabla intermedia
            where: { id_rol: 3 }
          }
        ],
        where: {
          disponibilidad: 'Disponible'
        }
      });
  
      // Obtener la cantidad de policías ocupados
      const ocupados = await Persona.count({
        include: [
          {
            model: Rol,
            through: { attributes: [] }, // No incluir atributos de la tabla intermedia
            where: { id_rol: 3 }
          }
        ],
        where: {
          disponibilidad: 'Ocupado'
        }
      });
  
      return {
        total: totalPolicias,
        disponibles: disponibles,
        ocupados: ocupados
      };
    } catch (error) {
      console.error('Error en getPoliciaCounts:', error.message);
      throw new Error('Error al obtener los contadores de policías');
    }
  };





  exports.getContadorSolicitudesTotal = async () => {
    try {
        // Contar el total de solicitudes
        const totalSolicitudes = await Solicitud.count();

        // Contar el número de solicitudes por tipo
        const counts = await Solicitud.findAll({
          attributes: [
            [sequelize.col('Subtipo.id_tipo'), 'id_tipo'],
            [sequelize.fn('COUNT', sequelize.col('Solicitud.id_solicitud')), 'count']
          ],
          include: [{
            model: Subtipo,
            attributes: []
          }],
          group: ['Subtipo.id_tipo'],
          raw: true
        });

        // Combinar los resultados
        return {
            total: totalSolicitudes,
            byType: counts
        };
    } catch (error) {
        console.error('Error al obtener el conteo por tipo de solicitud:', error);
        throw error;
    } 
};
