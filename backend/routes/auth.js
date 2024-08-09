const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/login', authController.login);

// Ruta para obtener el usuario autenticado
router.get('/auth', authenticateJWT, authController.getAuthenticatedUser);

module.exports = router;