const request = require("supertest");
const app = require("../app");

describe("End to end test", () => {
  let token;

  // prep antes de empezar test
  beforeAll(async () => {});

  // prep después del test
  afterAll(async () => {});

  // ## etapa 1.
  // autenticación
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

  // ## etapa 2.
  // fetch de proyectos
  test("should return all projects with their roles and status 200", async () => {
    const response = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // fetch de proyecto por id
  test("should return a project by id with status 200", async () => {
    const response = await request(app)
      .get("/api/projects")
      .send({ idproyecto: "1" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  // fetch de todas las aplicaciones en cierto proyecto
  test("should return applications of a certain project with status 200", async () => {
    const response = await request(app)
      .get("/api/apps/proyecto/89")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // fetch de todas las aplicaciones de cierto usuario
  test("should return applications of a certain project with status 200", async () => {
    const response = await request(app)
      .get("/api/apps/usuario/2")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // fetch de las skills técnicas
  test("should return the technical skills with status 200", async () => {
    const response = await request(app)
      .get("/api/habilidades/por-tipo?isTechnical=true")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // fetch de las skills no técnicas
  test("should return the non-technical skills with status 200", async () => {
    const response = await request(app)
      .get("/api/habilidades/por-tipo?isTechnical=false")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});
