const request = require("supertest");
const app = require("../app");

describe("Certifications API - GET endpoints", () => {
  let token;

  // Autenticación
  test("should return 200 and a token on successful login", async () => {
    const res = await request(app)
      .post("/api/authenticate")
      .send({
        providerid: "antonio.sosa",
        password: "hola123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  // GET: Obtener certificados de un empleado
  test("should return certifications for a given employee", async () => {
    const employeeId = 4; // Usa un id real que tenga certificaciones

    const res = await request(app)
      .get(`/api/certificados/empleado/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // GET: URL firmada de imagen de certificado
  test("should return signed image URL for a certification", async () => {
  const certificationId = 1;

  const res = await request(app)
    .get(`/api/certificaciones/image-url/${certificationId}`)
    .set("Authorization", `Bearer ${token}`);

  if (res.statusCode === 404) {
    expect(res.body).toHaveProperty("error");
  } else {
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("url"); // Cambiado aquí
  }
});


  // Falta de token
  test("should return 401 if token is missing (image-url)", async () => {
    const res = await request(app)
      .get("/api/certificaciones/image-url/1");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
