// app.js — instancia principal de Express (sin listen, para poder testear con supertest)
const express = require('express'); // framework web minimalista
const userRoutes = require('./routes/users'); // rutas de /api/users

const app = express(); // crea la app
app.use(express.json()); // parsea cuerpos JSON en req.body

app.get('/health', (req, res) => res.json({ ok: true })); // healthcheck simple
app.use('/api/users', userRoutes); // monta las rutas de usuarios

module.exports = app; // se exporta sin levantar servidor (los tests la importan)
