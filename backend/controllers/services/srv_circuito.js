const { Circuito } = require('../../models/db_models');

/**
 * * Crea un nuevo circuito en la base de datos.
 * @param {Object} circuitoData - Los datos del circuito a crear.
 * @returns {Object} - El circuito creado.
 */
// * Modulo en funcionamiento
exports.createCircuito = async (circuitoData) => {
    return await Circuito.create(circuitoData);
};

/**
 * * Obtiene todos los circuitos o filtra los circuitos según los parámetros proporcionados.
 * @param {Object} filters - Filtros opcionales para aplicar a la consulta.
 * @returns {Array} - Lista de circuitos que coinciden con los filtros.
 */
// * Modulo en funcionamiento
exports.getCircuitos = async (filters) => {
    const query = {};
    if (filters.provincia) {
        query.provincia = filters.provincia;
    }
    if (filters.ciudad) {
        query.ciudad = filters.ciudad;
    }
    if (filters.barrio) {
        query.barrio = filters.barrio;
    }

    return await Circuito.findAll({ where: query });
};

/**
 * * Obtiene un circuito por su ID.
 * @param {number} id - El ID del circuito a obtener.
 * @returns {Object} - El circuito encontrado o null si no existe.
 */
// * Modulo en funcionamiento
exports.getCircuitoById = async (id) => {
    return await Circuito.findByPk(id);
};

/**
 * * Actualiza los datos de un circuito existente.
 * @param {number} id - El ID del circuito a actualizar.
 * @param {Object} circuitoData - Los nuevos datos del circuito.
 * @returns {Object} - El circuito actualizado o null si no se encontró.
 */
// * Modulo en funcionamiento
exports.updateCircuito = async (id, circuitoData) => {
    const circuito = await Circuito.findByPk(id);
    if (circuito) {
        return await circuito.update(circuitoData);
    }
    return null;
};

/**
 * * Elimina un circuito por su ID.
 * @param {number} id - El ID del circuito a eliminar.
 * @returns {Object} - El circuito eliminado o null si no se encontró.
 */
// * Modulo en funcionamiento
exports.deleteCircuito = async (id) => {
    const circuito = await Circuito.findByPk(id);
    if (circuito) {
        await circuito.destroy();
        return circuito;
    }
    return null;
};
