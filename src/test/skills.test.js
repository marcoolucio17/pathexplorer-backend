const request = require("supertest");
const app = require("../app"); 

describe("Tests de habilidades por tipo", () => {
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

  //  falta el parámetro isTechnical
  test("should return 400 when isTechnical is missing", async () => {
    const response = await request(app)
      .get("/api/habilidades/por-tipo")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  //  sin token
  test("should return 401 when token is missing", async () => {
    const response = await request(app)
      .get("/api/habilidades/por-tipo")
      .query({ isTechnical: true });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
});
