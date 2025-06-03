const path = require("path");
const request = require("supertest");
const app = require("../app");



describe("AI API - Analizar CV", () => {
  let token;

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
  });

  test("should return 400 if file is not provided", async () => {
    const res = await request(app)
      .post("/api/analizar-cv")
      .set("Authorization", `Bearer ${token}`)
      .field("idusuario", 1);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Archivo no proporcionado o vacío");
  });

  test("should return 400 if idusuario is not provided", async () => {
    const fakePDFPath = path.join(__dirname, "fake-cv.pdf"); // crea un archivo vacío si no existe

    const res = await request(app)
      .post("/api/analizar-cv")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", fakePDFPath); // envía un archivo pero no envía idusuario

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "No se pudo identificar al usuario");
  });

  test("should return 401 if token is missing", async () => {
    const res = await request(app)
      .post("/api/analizar-cv");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
