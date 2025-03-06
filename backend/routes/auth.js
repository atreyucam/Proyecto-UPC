const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');
const { forgotPassword, resetPassword } = require("../controllers/authController");

router.post('/login', authController.login);

// Ruta para obtener el usuario autenticado
router.get('/auth', authenticateJWT, authController.getAuthenticatedUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;