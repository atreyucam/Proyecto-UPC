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
        const countsByType = await Solicitud.findAll({
            attributes: [
                [sequelize.col('Subtipo.id_tipo'), 'id_tipo'],
                [sequelize.fn('COUNT', sequelize.col('Solicitud.id_solicitud')), 'count'],
                [sequelize.col('Subtipo->TipoSolicitud.descripcion'), 'tipo_descripcion'] // Incluir descripción del tipo
            ],
            include: [
                {
                    model: Subtipo,
                    attributes: [],
                    include: [
                        {
                            model: TipoSolicitud,
                            attributes: []
                        }
                    ]
                }
            ],
            group: ['Subtipo.id_tipo', 'Subtipo->TipoSolicitud.descripcion'], // Agrupar por tipo de solicitud y su descripción
            raw: true
        });

        // Mapear los resultados para incluir la descripción del tipo
        const countsWithDescriptions = countsByType.map(count => ({
            id_tipo: count.id_tipo,
            tipo_descripcion: count.tipo_descripcion,
            count: parseInt(count.count, 10) // Convertir el conteo a número
        }));

        // Contar el número de solicitudes por estado
        const countsByStatus = await Solicitud.findAll({
            attributes: [
                [sequelize.col('Estado.descripcion'), 'estado_descripcion'],
                [sequelize.fn('COUNT', sequelize.col('Solicitud.id_solicitud')), 'count']
            ],
            include: [
                {
                    model: Estado,
                    attributes: []
                }
            ],
            group: ['Estado.descripcion'], // Agrupar por descripción del estado
            raw: true
        });

        // Mapear los resultados para incluir la descripción del estado
        const countsByStatusMap = countsByStatus.reduce((acc, status) => {
            acc[status.estado_descripcion] = parseInt(status.count, 10); // Convertir el conteo a número
            return acc;
        }, {});

        // Combinar los resultados
        return {
            total: {
                label: "Solicitudes registradas",
                count: totalSolicitudes
            },
            byStatus: {
                title: "Por tipos de solicitud",
                counts: {
                    'Solicitudes pendientes': countsByStatusMap['Pendiente'] || 0,
                    'Solicitudes en Progreso': countsByStatusMap['En progreso'] || 0,
                    'Solicitudes resueltas': countsByStatusMap['Resuelto'] || 0,
                    'Solicitudes falsas': countsByStatusMap['Falso'] || 0
                }
            },
            porTipoSolicitud: countsWithDescriptions,
        };
    } catch (error) {
        console.error('Error al obtener el conteo por tipo de solicitud:', error);
        throw error;
    }
};
