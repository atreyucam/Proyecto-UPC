require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const app = express();
const port = 3000;

// Configura Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.get('/call', (req, res) => {
    if (!req.query.to) {
      return res.status(400).send('Número de destino no especificado');
    }
  
    client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: req.query.to,
      from: process.env.TWILIO_PHONE_NUMBER
    })
    .then(call => res.send(`Llamada iniciada con ID: ${call.sid}`))
    .catch(e => {
      console.error(e);
      res.status(500).send(`Error al iniciar la llamada: ${e.message}`);
    });
  });
  
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
