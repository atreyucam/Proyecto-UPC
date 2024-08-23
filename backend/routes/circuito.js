const express = require('express');
const router = express.Router();
const circuitoController = require('../controllers/ctr_circuito');

// * Funcionan
router.get('/zonas/jerarquia', circuitoController.getZonasConJerarquia);
router.get('/zonas', circuitoController.getZonas);
router.get('/subzonas', circuitoController.getSubzonas);
router.get('/zonas/:id_zona/subzonas', circuitoController.getSubzonasByZona);
router.get('/subzonas/:id_subzona/cantones', circuitoController.getCantonesBySubzona);
router.get('/cantones/:id_canton/parroquias', circuitoController.getParroquiasByCanton);
// llama  a los cantones y parroquias de un distrito.
router.get('/distritos/:id_distrito/detalles', circuitoController.getDistritoWithDetails);
// ve a que distrito pertenece un canton
router.get('/canton/:id_canton/distrito', circuitoController.getDistritoByCanton);

// Definir la ruta para obtener un distrito con sus circuitos y subcircuitos
router.get('/distritos/:id_distrito/circuitos', circuitoController.getDistritoWithCircuitos);







module.exports = router;
