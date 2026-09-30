// data/mockUsers.js — datos mock reutilizables en servicio y tests
const mockUsers = [
  // lista base de usuarios ficticios
  { id: 1, name: 'Carlos', email: 'carlos@example.com' }, // mock 1
  { id: 2, name: 'Ana', email: 'ana@example.com' }, // mock 2
];

const newUserPayload = { name: 'Carlos', email: 'carlos@example.com' }; // payload válido para POST
const invalidUserPayload = { name: 'Carlos' }; // payload sin email (para probar 400)

module.exports = { mockUsers, newUserPayload, invalidUserPayload }; // exporta los mocks
