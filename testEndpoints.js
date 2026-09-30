// testEndpoints.js — pruebas originales (compatibles con app.js + services/userService.js)
const request = require('supertest'); // cliente HTTP para probar endpoints sin levantar servidor
const app = require('./app'); // app Express (misma carpeta, por eso './app')
const UserService = require('./services/userService'); // servicio mockeado (evita DB real)

// Mockea la capa de servicio/DB para evitar llamadas reales
jest.mock('./services/userService');

describe('POST /api/users', () => {
  it('Debe crear un usuario y retornar estado 201', async () => {
    // Arrange: Preparamos el mock de la DB
    const mockUser = { id: 1, name: 'Carlos', email: 'carlos@example.com' };
    UserService.create.mockResolvedValue(mockUser);

    // Act: Ejecutamos la petición al endpoint
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Carlos', email: 'carlos@example.com' });

    // Assert: Verificamos el resultado
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('carlos@example.com');
  });

  it('Debe devolver 400 si falta el email', async () => {
    const response = await request(app).post('/api/users').send({ name: 'Carlos' });

    expect(response.statusCode).toBe(400);
  });
});
