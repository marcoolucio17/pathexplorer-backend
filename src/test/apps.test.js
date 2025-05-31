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
  it('should return all apps of a project with status 200', async () => {
  const res = await request(app)
    .get(`/api/apps/proyecto/${testProjectId}`) // ✅ RUTA CORRECTA
    .set('Authorization', `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

it('should return all apps of a user with status 200', async () => {
  const res = await request(app)
    .get(`/api/apps/usuario/${testUserId}`) // ✅ RUTA CORRECTA
    .set('Authorization', `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

it('should return a specific user app in a project with status 200', async () => {
  const res = await request(app)
    .get(`/api/apps/usuario/${testUserId}/app/${testAppId}`) // ✅ RUTA CORRECTA
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

//aplicaciones de proyecto por manager
describe("api/projects/manager project aplications", () => {
  let token;

  beforeAll(async () => {
    const userCredentials = {
      providerid: "antonio.sosa",
      password: "hola123",
    };
    const res = await request(app)
      .post("/api/authenticate")
      .send(userCredentials);

    token = res.body.token;
  });

  test("Should return applications with project name and user profile image", async () => {
    const idUsuarioCreador = 4;

    const res = await request(app)
      .get(`/api/creador/${idUsuarioCreador}/aplicaciones`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const appItem = res.body[0];

      expect(appItem).toHaveProperty("idaplicacion");
      expect(appItem).toHaveProperty("idproyecto");
      expect(appItem).toHaveProperty("nombreproyecto");

      expect(appItem).toHaveProperty("usuario");
      expect(appItem.usuario).toHaveProperty("idusuario");
      expect(appItem.usuario).toHaveProperty("nombre");
      expect(appItem.usuario).toHaveProperty("correoelectronico");
      expect(appItem.usuario).toHaveProperty("fotodeperfil_url");

      expect(appItem).toHaveProperty("roles");
      expect(appItem.roles).toHaveProperty("nombrerol");
    }
  });
});
