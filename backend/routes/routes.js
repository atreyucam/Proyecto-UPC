const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roles');
const personaController = require('../controllers/persona');

// Rutas para roles
router.post('/roles', roleController.createRole);
router.get('/roles', roleController.getAllRol);
router.get('/roles/:id', roleController.getRoleById);
router.put('/roles/:id', roleController.updateRole);
router.delete('/roles/:id', roleController.deleteRole);

// Ruta para personas
router.post('/personas', personaController.createPersona);
router.get('/personas', personaController.getAllPersona);
router.get('/personas/:id', personaController.getPersonaById);
router.put('/personas/:id', personaController.updatePersona);
router.delete('/personas/:id', personaController.deletePersona);

module.exports = router;
