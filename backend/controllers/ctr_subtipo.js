const subtipoService = require('./services/srv_subtipo');

/**
 * * Controlador para crear un nuevo subtipo.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// * Modulo en funcionamiento
exports.createSubtipoPorTipo = async (req, res) => {
    const {id_tipo} = req.params;
    const {descripcion} = req.body;

    try {
        const nuevoSubtipo = await subtipoService.createSubtipo(id_tipo, descripcion);
        res.status(201).json(nuevoSubtipo);
    } catch (error) {
        if (error.message === 'TipoSolicitud no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
}

/**
 * * Controlador para crear un nuevo subtipo.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
// * Modulo en funcionamiento
exports.getSubtipos = async (req, res) => {
    try {
        const subtipos = await subtipoService.getSubtipos();
        res.status(200).json(subtipos);
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
}

/**
* * Controlador para obtener un subtipo por su ID.
* @param {Object} req - Objeto de solicitud HTTP.
* @param {Object} res - Objeto de respuesta HTTP.
*/
// * Modulo en funcionamiento
exports.getSubtipoById = async (req, res) => {
    try {
        const subtipo = await subtipoService.getSubtipoById(req.params.id);
        if (subtipo) {
            res.status(200).json(subtipo);
        } else {
            res.status(404).json({ message: 'subtipo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* * Controlador para actualizar un subtipo existente.
* @param {Object} req - Objeto de solicitud HTTP.
* @param {Object} res - Objeto de respuesta HTTP.
*/
// * Modulo en funcionamiento
exports.updateSubtipo = async (req, res) => {
    try {
        const subtipo = await subtipoService.updateSubtipo(req.params.id, req.body);
        if (subtipo) {
            res.status(200).json(subtipo);
        } else {
            res.status(404).json({ message: 'subtipo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* * Controlador para eliminar un subtipo por su ID.
* @param {Object} req - Objeto de solicitud HTTP.
* @param {Object} res - Objeto de respuesta HTTP.
*/
// * Modulo en funcionamiento
exports.deleteSubtipo = async (req, res) => {
    try {
        const subtipo = await subtipoService.deleteSubtipo(req.params.id);
        if (subtipo) {
            res.status(200).json({ message: 'subtipo ha sido eliminado' });
        } else {
            res.status(404).json({ message: 'subtipo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ------------------------------------
// nuevos
exports.getAllTiposSolicitud = async (req, res) => {
    try {
        const tipos = await subtipoService.getAllTiposSolicitud();
        if (tipos) {
            res.status(200).json(tipos); // Devolver los tipos obtenidos
        } else {
            res.status(404).json({ message: 'No se encontraron tipos de solicitud' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSubtiposByTipoId = async (req, res) => {
    const { id_tipo } = req.params;
    try {
        const subtipos = await subtipoService.getSubtiposByTipoId(id_tipo);
        res.status(200).json(subtipos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};