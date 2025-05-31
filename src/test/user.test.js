const request = require("supertest");
const app = require("../app");

describe("User API - GET endpoints", () => {
  let token;
  const userId = 1; // Cambia si usas otro idusuario

  // Autenticación antes de ejecutar los tests
  beforeAll(async () => {
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

  test("should return user data by ID", async () => {
  const res = await request(app)
    .get(`/api/usuario/${userId}`)
    .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("idusuario", userId);
    });


  test("should return signed CV URL for user", async () => {
    const res = await request(app)
      .get(`/api/cv-url/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    if (res.statusCode === 404) {
      expect(res.body).toHaveProperty("error");
    } else {
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("url");
    }
  });

  test("should return signed profile picture URL for user", async () => {
    const res = await request(app)
      .get(`/api/profile-url/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    if (res.statusCode === 404) {
      expect(res.body).toHaveProperty("error");
    } else {
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("url");
    }
  });

  test("should return 401 if token is missing", async () => {
    const res = await request(app).get(`/api/usuario/${userId}`);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
