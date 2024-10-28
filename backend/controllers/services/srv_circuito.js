
const { Zona,Subzona, Canton, Distrito,Parroquia, Circuito, Subcircuito } = require('../../models/db_models');

// Servicio para obtener todas las zonas con toda la jerarquía
exports.getZonasConJerarquia = async () => {
    try {
        return await Zona.findAll({
            include: [{ model: Subzona,
                include: [{ model: Canton,
                    include: [{ model: Distrito,
                        as: 'distritos',  // Usar alias 'distritos'
                        include: [{ model: Parroquia,
                            include: [{ model: Circuito,
                                include: [{ model: Subcircuito
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        });
    } catch (error) {
        console.error('Detalles del error:', error); // Log detallado del error
        throw new Error('Error al obtener las zonas con jerarquía completa');
    }
};

// Servicio para obtener todas las zonas
exports.getZonas = async () => {
    try {
        return await Zona.findAll();
    } catch (error) {
        throw new Error('Error al obtener las zonas');
    }
};
exports.getSubzonas = async () => {
    try {
        return await Subzona.findAll();
    } catch (error) {
        throw new Error('Error al obtener las zonas');
    }
};

// obtener las subzonas de una zona específica
exports.getSubzonasByZona = async (id_zona) => {
    try {
        const zona = await Zona.findByPk(id_zona, {
            attributes: ['id_zona', 'nombre_zona'],
            include: [{
                model: Subzona,
                attributes: ['id_subzona', 'nombre_subzona']
            }]
        });

        if (!zona) {
            throw new Error(`La zona con ID ${id_zona} no existe.`);
        }

        return zona;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Obtener cantones por subzona
exports.getCantonesBySubzona = async (id_subzona) => {
    try {
        const cantones =await Canton.findAll({
            attributes: ['id_canton', 'nombre_canton'],
            where: { id_subzona },
            include: [{
                model: Subzona,
                attributes: ['nombre_subzona'] // Solo incluye el nombre de la subzona
            }]
        });
        // Formatea la respuesta para incluir los nombres de las subzonas
        const formattedResponse = cantones.map(canton => ({
            id_canton: canton.id_canton,
            nombre_canton: canton.nombre_canton,
            nombre_subzona: canton.Subzona.nombre_subzona // Accede al nombre de la subzona
        }));

        return formattedResponse;
    } catch (error) {
        throw new Error('Error al obtener los cantones');
    }
};


// Servicio para obtener parroquias por cantón
exports.getParroquiasByCanton = async (id_canton) => {
    try {
        const parroquias = await Parroquia.findAll({
            where: { id_canton },
            attributes: ['id_parroquia', 'nombre_parroquia'], // Incluye solo los atributos necesarios
            include: [
                {
                    model: Canton,
                    attributes: ['nombre_canton'], // Incluye el nombre del cantón
                    where: { id_canton }, // Asegura que se filtre por el cantón especificado
                }
            ]
        });

        // Formateo de la respuesta
        const formattedResponse = parroquias.map(parroquia => ({
            id_parroquia: parroquia.id_parroquia,
            nombre_parroquia: parroquia.nombre_parroquia,
            nombre_canton: parroquia.Canton.nombre_canton
        }));

        return formattedResponse;

    } catch (error) {
        console.error('Error al obtener las parroquias por cantón:', error);
        throw new Error('Error al obtener las parroquias por cantón');
    }
};



// Servicio para obtener un distrito con sus cantones y parroquias
exports.getDistritoWithCantonesAndParroquias = async (id_distrito) => {
    try {
        const distrito = await Distrito.findOne({
            where: { id_distrito },
            attributes: ['id_distrito', 'nombre_distrito'], // Atributos del distrito
            include: [
                {
                    model: Canton,
                    as: 'cantones',
                    attributes: ['id_canton', 'nombre_canton'], // Atributos de los cantones
                    include: [
                        {
                            model: Parroquia,
                            attributes: ['id_parroquia', 'nombre_parroquia'], // Atributos de las parroquias
                        }
                    ]
                }
            ]
        });

        if (!distrito) {
            throw new Error(`El distrito con ID ${id_distrito} no existe.`);
        }

        return distrito;
    } catch (error) {
        console.error('Error al obtener el distrito con cantones y parroquias:', error);
        throw new Error('Error al obtener la información del distrito');
    }
};

// Obtener distrito por cantón
exports.getDistritoByCanton = async (id_canton) => {
    try {
        const canton = await Canton.findByPk(id_canton, {
            attributes: ['id_canton', 'nombre_canton', 'id_subzona'], 
            include: [
                {
                    model: Distrito,
                    as: 'distritos', // Usar el alias definido en la relación muchos a muchos
                    attributes: ['id_distrito', 'nombre_distrito'] 
                },
                {
                    model: Subzona,
                    attributes: ['nombre_subzona'] 
                }
            ]
        });

        // Si el cantón no existe, lanzar un error
        if (!canton) {
            throw new Error(`El cantón con ID ${id_canton} no existe.`);
        }

        const formattedResponse = {
            id_canton: canton.id_canton,
            nombre_canton: canton.nombre_canton,
            nombre_subzona: canton.Subzona.nombre_subzona, 
            distritos: canton.distritos.map(distrito => ({
                id_distrito: distrito.id_distrito,
                nombre_distrito: distrito.nombre_distrito
            }))
        };

        return formattedResponse;

    } catch (error) {
        throw new Error('Error al obtener los distritos');
    }
};



// Servicio para obtener un distrito con sus circuitos y subcircuitos
exports.getDistritoWithCircuitosAndSubcircuitos = async (id_distrito) => {
    try {
        const distrito = await Distrito.findOne({
            where: { id_distrito },
            attributes: ['id_distrito', 'nombre_distrito'], // Atributos del distrito
            include: [
                {
                    model: Circuito,
                    attributes: ['id_circuito', 'nombre_circuito'], // Atributos de los circuitos
                    include: [
                        {
                            model: Subcircuito,
                            attributes: ['id_subcircuito', 'nombre_subcircuito'], // Atributos de los subcircuitos
                        }
                    ]
                }
            ]
        });

        if (!distrito) {
            throw new Error(`El distrito con ID ${id_distrito} no existe.`);
        }

        return distrito;
    } catch (error) {
        console.error('Error al obtener el distrito con circuitos y subcircuitos:', error);
        throw new Error('Error al obtener la información del distrito');
    }
};
























