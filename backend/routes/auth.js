const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/login', authController.login);

// Ruta para obtener el usuario autenticado
router.get('/authUser', authController.getAuthenticatedUser);

// nuevas rutas

router.post('/verify-email', authController.verifyEmail);
router.post("/send-verification", authController.sendVerificationEmail);
router.post("/verify-otp", authController.verifyOTP);
router.post('/forgot-password', authController.sendPasswordResetEmail);
router.post('/reset-password', authController.resetPassword);

module.exports = router;