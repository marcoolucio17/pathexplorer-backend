// src/test/feedback.test.js
const request = require("supertest");
const app = require("../app");

describe("Feedback API", () => {
  let token;

  // Autenticación previa al resto de los tests
  test("should return 200 and a token on successful login", async () => {
    const userCredentials = {
      providerid: "antonio.sosa",
      password: "hola123",
    };
    const res = await request(app)
      .post("/api/authenticate")
      .send(userCredentials);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
    console.log(token);

  });

  // Test: Obtener feedbacks de un usuario
  test("should return feedbacks for a user", async () => {
    const idUsuarioObjetivo = 2; // Cambia este ID si es necesario

    const res = await request(app)
      .get(`/api/feedback/${idUsuarioObjetivo}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("feedbacks");
    expect(Array.isArray(res.body.feedbacks)).toBe(true);
  });

  // Test: Error por falta de token
  test("should return 401 if token is missing", async () => {
    const res = await request(app).get("/api/feedback/2");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
