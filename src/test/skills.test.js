const request = require("supertest");
const app = require("../app");

describe("Tests de habilidades por tipo", () => {
  let token;

  // autenticación
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/authenticate")
      .send({
        providerid: "antonio.sosa",
        password: "hola123",
      });

    token = res.body.token;
  });

  // obtener habilidades técnicas
  test("should return technical skills with status 200", async () => {
    const response = await request(app)
      .get("/api/habilidades/por-tipo")
      .query({ isTechnical: true })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // obtener habilidades no técnicas
  test("should return non-technical skills with status 200", async () => {
    const response = await request(app)
      .get("/api/habilidades/por-tipo")
      .query({ isTechnical: false })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // falta el parámetro isTechnical
  test("should return 400 when isTechnical is missing", async () => {
    const response = await request(app)
      .get("/api/habilidades/por-tipo")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  // sin token
  test("should return 401 when token is missing", async () => {
    const response = await request(app)
      .get("/api/habilidades/por-tipo")
      .query({ isTechnical: true });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
});

// Test adicional para obtener todas las habilidades
describe("GET /api/habilidades", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/authenticate")
      .send({
        providerid: "antonio.sosa",
        password: "hola123",
      });

    token = res.body.token;
  });

  test("should return all skills with status 200", async () => {
    const res = await request(app)
      .get("/api/habilidades")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const skill = res.body[0];
      expect(skill).toHaveProperty("idhabilidad");
      expect(skill).toHaveProperty("nombre");
      expect(skill).toHaveProperty("estecnica");
    }
  });

  test("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/habilidades");
    expect(res.statusCode).toBe(401);
  });
});
