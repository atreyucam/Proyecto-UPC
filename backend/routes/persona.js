const express = require('express');
const router = express.Router();
const personaController = require('../controllers/ctr_persona');

// * Rutas de filtrado y contadores
// * En funcionamiento
router.get('/ciudadanos', personaController.getCiudadanos);


router.get('/policias', personaController.getPolicias);
router.get('/policiasDisponibles', personaController.getPoliciasDisponibles);
router.get('/policia/:id', personaController.getPoliciaConSolicitudes);
router.get('/ciudadano/:id', personaController.getCiudadanoConSolicitudes);
router.get('/ciudadanoUser/:id', personaController.getCiudadanoUser);


// * Rutas CRUD basicos
// * En funcionamiento
// router.post('/nuevoUsuario', personaController.createPersona);
router.get('/', personaController.getPersonas);
router.get('/:id', personaController.getPersonaById);
router.put('/:id', personaController.updatePersona);
router.delete('/:id', personaController.deletePersona);


// actualizar password
router.post("/verificar-contrasena/:id_persona", personaController.verificarContrasena);
router.put("/actualizar-contrasena/:id_persona", personaController.actualizarContrasena);


// ! Rutas nuevas por verificar
router.post('/nuevoCiudadano', personaController.createCiudadano);
router.post('/nuevoPolicia', personaController.createPolicia);
router.post('/nuevoAdmin', personaController.createAdmin);

// consuta
router.get("/verificarCedula/:cedula", personaController.verificarCedula);


module.exports = router;