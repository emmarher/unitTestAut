// services/userService.js — capa de datos (en memoria, simula una DB)
const { mockUsers } = require('../data/mockUsers'); // datos iniciales

let users = [...mockUsers]; // copia mutable en memoria
let nextId = users.length + 1; // contador simple para ids nuevos

module.exports = {
  getAll: async () => users, // GET /api/users
  getById: async (id) => users.find((u) => u.id === Number(id)) || null, // GET /:id
  create: async ({ name, email }) => {
    // POST /
    const user = { id: nextId++, name, email }; // crea objeto con id autoincremental
    users.push(user); // guarda en memoria
    return user; // retorna el creado
  },
  update: async (id, { name, email }) => {
    // PUT /:id
    const i = users.findIndex((u) => u.id === Number(id)); // busca posición
    if (i === -1) return null; // no existe -> null (ruta responde 404)
    users[i] = { ...users[i], ...(name && { name }), ...(email && { email }) }; // actualiza solo lo enviado
    return users[i]; // retorna el actualizado
  },
  remove: async (id) => {
    // DELETE /:id
    const i = users.findIndex((u) => u.id === Number(id)); // busca posición
    if (i === -1) return null; // no existe -> null
    const [deleted] = users.splice(i, 1); // elimina y captura el objeto
    return deleted; // retorna el eliminado
  },
  __reset: () => {
    users = [...mockUsers];
    nextId = users.length + 1;
  }, // resetea estado (útil en tests sin mock)
};
