const circuitoService = require('../services/srv_circuito');


// Controlador para obtener todas las zonas con toda la jerarquía
exports.getZonasConJerarquia = async (req, res) => {
    try {
        const zonasConJerarquia = await circuitoService.getZonasConJerarquia();
        res.status(200).json(zonasConJerarquia);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las zonas con jerarquía completa' });
    }
};

// Controlador para obtener todas las zonas
exports.getZonas = async (req, res) => {
    try {
        const zonas = await circuitoService.getZonas();
        res.status(200).json(zonas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las zonas' });
    }
};
// Controlador para obtener todas las zonas
exports.getSubzonas = async (req, res) => {
    try {
        const zonas = await circuitoService.getSubzonas();
        res.status(200).json(zonas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las zonas' });
    }
};

// Controlador para obtener subzonas por id_zona
exports.getSubzonasByZona = async (req, res) => {
    try {
        const { id_zona } = req.params;
        const zona = await circuitoService.getSubzonasByZona(id_zona);

        if (!zona) {
            return res.status(404).json({ message: `La zona con ID ${id_zona} no existe.` });
        }

        res.status(200).json(zona);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener cantones por subzona
exports.getCantonesBySubzona = async (req, res) => {
    try {
        const { id_subzona } = req.params;
        const cantones = await circuitoService.getCantonesBySubzona(id_subzona);
        res.status(200).json(cantones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener distritos por cantón
exports.getDistritoByCanton = async (req, res) => {
    try {
        const { id_canton } = req.params;
        const distritos = await circuitoService.getDistritoByCanton(id_canton);
        res.status(200).json(distritos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los distritos' });
    }
};

// Controlador para obtener subcircuitos por circuito
exports.getParroquiasByCanton = async (req, res) => {
    const { id_canton } = req.params;

    try {
        const parroquias = await circuitoService.getParroquiasByCanton(id_canton);
        res.status(200).json(parroquias);
    } catch (error) {
        console.error('Error al obtener las parroquias por cantón:', error);
        res.status(500).json({ message: 'Error al obtener las parroquias por cantón' });
    }
};


exports.getDistritoWithDetails = async (req, res) => {
    const { id_distrito } = req.params;

    try {
        const distrito = await circuitoService.getDistritoWithCantonesAndParroquias(id_distrito);
        res.status(200).json(distrito);
    } catch (error) {
        console.error('Error al obtener el distrito con detalles:', error);
        res.status(500).json({ message: 'Error al obtener la información del distrito' });
    }
};


exports.getDistritoWithCircuitos = async (req, res) => {
    const { id_distrito } = req.params;

    try {
        const distrito = await circuitoService.getDistritoWithCircuitosAndSubcircuitos(id_distrito);
        res.status(200).json(distrito);
    } catch (error) {
        console.error('Error al obtener el distrito con detalles:', error);
        res.status(500).json({ message: 'Error al obtener la información del distrito' });
    }
};
