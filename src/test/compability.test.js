const request = require("supertest");
const app = require("../app");

describe("Compability API", () => {
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

  test("should return 200 and a number when valid id_rol and idusuario are provided", async () => {
    const res = await request(app)
      .get("/api/compability")
      .query({ id_rol: 1, idusuario: 4 }) // Usa IDs válidos de tu base de datos
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("number"); // si tu resultado es solo el número
  });

  test("should return 400 when parameters are missing", async () => {
    const res = await request(app)
      .get("/api/compability")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing parameters");
  });

  test("should return 401 when token is missing", async () => {
    const res = await request(app)
      .get("/api/compability")
      .query({ id_rol: 1, idusuario: 4 });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
