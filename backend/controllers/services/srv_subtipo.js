const { Subtipo, TipoSolicitud } = require('../../models/db_models');


 //Crea un nuevo subtipo en base a los tipos de solicitud disponible.
exports.createSubtipo = async (id_tipo, descripcion) => {
    try {
        const tipo = await TipoSolicitud.findByPk(id_tipo); // Verificar si el TipoSolicitud existe
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

//Regresa todos los subtipos por su tipo de solicitud.
exports.getSubtipos = async () =>{
    try {
        const subtipos = await Subtipo.findAll();
        return subtipos;
    } catch (error) {
        throw error;
    }
}

//Regresa el subtipo por su id.
exports.getSubtipoById = async (id) => {
    return await Subtipo.findByPk(id);
}

//actualiza el subtipo por su id.
exports.updateSubtipo = async (id, subtipoData) => {
    const subtipo = await Subtipo.findByPk(id);
    if(subtipo){
        return await subtipo.update(subtipoData);
    }
    return null;
}

// Elimina el subtipo por su id.
exports.deleteSubtipo = async (id) => {
    const subtipo = await Subtipo.findByPk(id);
    if(subtipo){
        return await subtipo.destroy();
    }
    return null;
}

// tipos de solicitud 
exports.getAllTiposSolicitud = async () => {
    try {
        const tipos = await TipoSolicitud.findAll({
            attributes: ['id_tipo', 'descripcion']
        });
        return tipos;
    } catch (error) {
        throw new Error('Error al obtener los tipos de solicitud: ' + error.message);
    }
};

// subtipos por tipo
exports.getSubtiposByTipoId = async (id_tipo) => {
    try {
        const subtipos = await Subtipo.findAll({
            where: { id_tipo },
            attributes: ['id_subtipo', 'descripcion'] 
        });
        return subtipos;
    } catch (error) {
        throw new Error('Error al obtener los subtipos del tipo de solicitud: ' + error.message);
    }
};