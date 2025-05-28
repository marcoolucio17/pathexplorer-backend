require('dotenv').config();
const request = require('supertest');
const app = require('../app'); // Asegúrate de que apunta a tu archivo principal de Express

describe('Clientes API', () => {
  let token;

  beforeAll(async () => {
    // Autenticación si es requerida
    const credentials = {
      providerid: "antonio.sosa",
      password: "hola123"
    };

    const res = await request(app)
      .post('/api/authenticate')
      .send(credentials);

    token = res.body.token;
  });

  // Test para GET /api/clientes
  test('should return all clients with status 200', async () => {
    const res = await request(app)
      .get('/api/clientes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test para GET /api/clientes/:id
  test('should return a specific client by id with status 200', async () => {
    const id = 1; // Asegúrate de tener un cliente con este ID
    const res = await request(app)
      .get(`/api/clientes/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('idcliente', id);
  });

  // Test para cliente inexistente
  test('should return 404 for a non-existing client', async () => {
    const res = await request(app)
      .get('/api/clientes/99999') // ID inexistente
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
//npm test src/test/clientes.test.js