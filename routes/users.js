// routes/users.js — endpoints CRUD de usuarios
const { Router } = require('express'); // router para agrupar rutas
const UserService = require('../services/userService'); // capa de datos (mockeada en tests)

const router = Router(); // crea el router

router.get('/', async (req, res) => {
  // GET /api/users — lista todos
  const users = await UserService.getAll(); // pide datos al servicio
  res.json(users); // 200 con el arreglo
});

router.get('/:id', async (req, res) => {
  // GET /api/users/:id — uno por id
  const user = await UserService.getById(req.params.id); // busca por id
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' }); // no existe
  res.json(user); // 200 con el usuario
});

router.post('/', async (req, res) => {
  // POST /api/users — crea uno
  const { name, email } = req.body; // extrae campos
  if (!name || !email) return res.status(400).json({ error: 'name y email son requeridos' }); // validación mínima
  const user = await UserService.create({ name, email }); // crea vía servicio
  res.status(201).json(user); // 201 con el creado
});

router.put('/:id', async (req, res) => {
  // PUT /api/users/:id — actualiza
  const { name, email } = req.body; // campos a actualizar
  if (!name && !email) return res.status(400).json({ error: 'Envía name o email para actualizar' }); // nada que actualizar
  const user = await UserService.update(req.params.id, { name, email }); // actualiza vía servicio
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' }); // no existe
  res.json(user); // 200 con el actualizado
});

router.delete('/:id', async (req, res) => {
  // DELETE /api/users/:id — elimina
  const user = await UserService.remove(req.params.id); // elimina vía servicio
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' }); // no existe
  res.json(user); // 200 con el eliminado
});

module.exports = router; // exporta el router para app.js
