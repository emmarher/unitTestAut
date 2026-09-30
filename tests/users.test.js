// tests/users.test.js — suite completa de endpoints (mockea el servicio, no toca DB real)
const request = require('supertest'); // cliente HTTP para probar la app sin levantar puerto
const app = require('../app'); // app Express a testear
const UserService = require('../services/userService'); // servicio a mockear
const { mockUsers, newUserPayload, invalidUserPayload } = require('../data/mockUsers'); // datos mock

jest.mock('../services/userService'); // mockea todo el módulo (funciones -> jest.fn())

beforeEach(() => jest.clearAllMocks()); // limpia llamadas entre tests para aislarlos

describe('GET /api/users', () => {
  it('retorna 200 y la lista de usuarios', async () => {
    // caso feliz
    UserService.getAll.mockResolvedValue(mockUsers); // Arrange: simula DB con 2 users
    const res = await request(app).get('/api/users'); // Act: pide la lista
    expect(res.statusCode).toBe(200); // Assert: código OK
    expect(res.body).toHaveLength(2); // Assert: trae los 2 mocks
  });
});

describe('GET /api/users/:id', () => {
  it('retorna 200 y el usuario si existe', async () => {
    // caso feliz
    UserService.getById.mockResolvedValue(mockUsers[0]); // Arrange: simula que existe
    const res = await request(app).get('/api/users/1'); // Act
    expect(res.statusCode).toBe(200); // Assert
    expect(res.body.email).toBe('carlos@example.com'); // Assert: dato correcto
  });

  it('retorna 404 si no existe', async () => {
    // caso no encontrado
    UserService.getById.mockResolvedValue(null); // Arrange: simula ausencia
    const res = await request(app).get('/api/users/99'); // Act
    expect(res.statusCode).toBe(404); // Assert
  });
});

describe('POST /api/users', () => {
  it('crea un usuario y retorna 201', async () => {
    // caso feliz (igual que testEndpoints.js)
    UserService.create.mockResolvedValue(mockUsers[0]); // Arrange: simula creación
    const res = await request(app).post('/api/users').send(newUserPayload); // Act: envía payload válido
    expect(res.statusCode).toBe(201); // Assert: creado
    expect(res.body).toHaveProperty('id'); // Assert: trae id
    expect(res.body.email).toBe('carlos@example.com'); // Assert: email correcto
  });

  it('devuelve 400 si falta el email', async () => {
    // validación
    const res = await request(app).post('/api/users').send(invalidUserPayload); // Act: payload incompleto
    expect(res.statusCode).toBe(400); // Assert: bad request (ni llama al servicio)
    expect(UserService.create).not.toHaveBeenCalled(); // Assert: no llega a DB
  });

  it('devuelve 400 si falta el name', async () => {
    // validación espejo
    const res = await request(app).post('/api/users').send({ email: 'x@y.com' }); // Act
    expect(res.statusCode).toBe(400); // Assert
  });
});

describe('PUT /api/users/:id', () => {
  it('actualiza y retorna 200 si existe', async () => {
    // caso feliz
    const updated = { ...mockUsers[0], name: 'Carlos Updated' }; // dato esperado
    UserService.update.mockResolvedValue(updated); // Arrange: simula update
    const res = await request(app).put('/api/users/1').send({ name: 'Carlos Updated' }); // Act
    expect(res.statusCode).toBe(200); // Assert
    expect(res.body.name).toBe('Carlos Updated'); // Assert: cambio aplicado
  });

  it('retorna 400 si no envían nada para actualizar', async () => {
    // validación
    const res = await request(app).put('/api/users/1').send({}); // Act: body vacío
    expect(res.statusCode).toBe(400); // Assert
  });

  it('retorna 404 si no existe', async () => {
    // no encontrado
    UserService.update.mockResolvedValue(null); // Arrange
    const res = await request(app).put('/api/users/99').send({ name: 'X' }); // Act
    expect(res.statusCode).toBe(404); // Assert
  });
});

describe('DELETE /api/users/:id', () => {
  it('elimina y retorna 200 si existe', async () => {
    // caso feliz
    UserService.remove.mockResolvedValue(mockUsers[0]); // Arrange: simula borrado
    const res = await request(app).delete('/api/users/1'); // Act
    expect(res.statusCode).toBe(200); // Assert
    expect(res.body.id).toBe(1); // Assert: confirma cuál borró
  });

  it('retorna 404 si no existe', async () => {
    // no encontrado
    UserService.remove.mockResolvedValue(null); // Arrange
    const res = await request(app).delete('/api/users/99'); // Act
    expect(res.statusCode).toBe(404); // Assert
  });
});
