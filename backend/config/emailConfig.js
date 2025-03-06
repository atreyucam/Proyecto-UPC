const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // tu cuenta de gmail o corporativa
    pass: process.env.EMAIL_PASSWORD    // la contraseña de aplicación (app password)
  }
});

module.exports = transporter;
