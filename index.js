require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const database = require('./database/connectdb');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const router = require('./routes/auth.route.js');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// Importa y usa el router exportado
app.use('/api/v1', router);

//SOLICITUDES
app.get('/', (req, res) => {
  res.send('BACKEND 💻.');
});

// Conectar con la base de datos
mongoose.connect(process.env.URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
  });

// PUERTOS

const PUERTO = process.env.PORT || 5500;

app.listen(PUERTO, () => {
  console.log(`El servidor está escuchando en el puerto ${PUERTO}...`);
});
