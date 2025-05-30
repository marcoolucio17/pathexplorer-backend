const request = require('supertest');
const app = require('../app'); // Asegúrate de que esta ruta sea correcta

// IDs de prueba
const testProjectId = 1;
const testUserId = 2;
const testAppId = 1;

describe('Aplicaciones API', () => {
    let token;

  // autenticacion 
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/authenticate")
      .send({
        providerid: "antonio.sosa",
        password: "hola123",
      });

    token = res.body.token;
  });
  // Test: Obtener todas las apps de un proyecto
  it('should return all apps of a project with status 200', async () => {
    const res = await request(app)
      .get(`/aplicaciones/proyecto/${testProjectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test: Obtener todas las apps de un usuario
  it('should return all apps of a user with status 200', async () => {
    const res = await request(app)
      .get(`/aplicaciones/usuario/${testUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test: Obtener una aplicación específica
  it('should return a specific user app in a project with status 200', async () => {
    const res = await request(app)
      .get(`/aplicaciones/${testUserId}/${testAppId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('idaplicacion');
  });

  // Test: App inexistente debe devolver 404 o 500
  it('should return 404 or 500 for non-existing app', async () => {
    const res = await request(app)
      .get(`/aplicaciones/999999/999999`)
      .set('Authorization', `Bearer ${token}`);

    expect([404, 500]).toContain(res.statusCode);
  });
});
