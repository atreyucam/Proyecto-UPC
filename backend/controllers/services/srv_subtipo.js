const { Subtipo, TipoSolicitud } = require('../../models/db_models');

/**
 * * Crea un nuevo subtipo en base a los tipos de solicitud disponible.
 * @param {objeto} subtipoData - Los datos del subtipo a crear.
 * @returns {objeto} - Regresa el subtipo creado en un tipo de solicitud.
 * 
 * * Modulo en funcionamiento
 */
exports.createSubtipo = async (id_tipo, descripcion) => {
    // verificar si el tipo de solicitud existe
    try {
        // Verificar si el TipoSolicitud existe
        const tipo = await TipoSolicitud.findByPk(id_tipo);
        if (!tipo) {
            throw new Error('TipoSolicitud no encontrado');
        }
    
        // Crear nuevo Subtipo
        const subtipos = descripcion.map(descripcion => ({ id_tipo, descripcion }));
        const nuevosSubtipos = await Subtipo.bulkCreate(subtipos);
    
        return nuevosSubtipos;
    } catch (error) {
        throw error;
    }
}

/**
 * * Regresa todos los subtipos por su tipo de solicitud.
 * @param {objeto} filtro - filtro de los subtipos por su tipo.
 * @returns {objeto} - Regresa los subtipos por su tipo.
 * 
 * * Modulo en funcionamiento
 */
exports.getSubtipos = async () =>{
    try {
        const subtipos = await Subtipo.findAll();
        return subtipos;

    } catch (error) {
        throw error;
    }
}

/**
 * * Regresa el subtipo por su id.
 * @param {objeto} id - el id del subtipo a obtener.
 * @returns {objeto} - Regresa el subtipo o null si no existe.
 * 
 * * Modulo en funcionamiento
 */
exports.getSubtipoById = async (id) => {
    return await Subtipo.findByPk(id);
}


/**
 * * actualiza el subtipo por su id.
 * @param {objeto} id - el id del subtipo a actualizar.
 * @param {objecto} subtipoData - los nuevos datos del subtipo.
 * @returns {objeto} - Regresa el subtipo actualizado o null si no se encontro.
 * 
 * * Modulo en funcionamiento
 */
exports.updateSubtipo = async (id, subtipoData) => {
    const subtipo = await Subtipo.findByPk(id);
    if(subtipo){
        return await subtipo.update(subtipoData);
    }
    return null;
}


/**
 * * Elimina el subtipo por su id.
 * @param {objeto} id - el id del subtipo a eliminar.
 * @returns {objeto} - Regresa el subtipo eliminado o null si no existe.
 * 
 * * Modulo en funcionamiento
 */
exports.deleteSubtipo = async (id) => {
    const subtipo = await Subtipo.findByPk(id);
    if(subtipo){
        return await subtipo.destroy();
    }
    return null;
}


// ---------------------------------------
// tipos de solicitud 
exports.getAllTiposSolicitud = async () => {
    try {
        const tipos = await TipoSolicitud.findAll({
            attributes: ['id_tipo', 'descripcion'] // Ajustar los atributos según los campos en tu modelo
        });
        return tipos;
    } catch (error) {
        throw new Error('Error al obtener los tipos de solicitud: ' + error.message);
    }
};

exports.getSubtiposByTipoId = async (id_tipo) => {
    try {
        const subtipos = await Subtipo.findAll({
            where: { id_tipo },
            attributes: ['id_subtipo', 'descripcion'] // Ajustar los atributos según los campos en tu modelo
        });
        return subtipos;
    } catch (error) {
        throw new Error('Error al obtener los subtipos del tipo de solicitud: ' + error.message);
    }
};