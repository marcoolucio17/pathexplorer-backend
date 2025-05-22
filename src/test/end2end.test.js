const request = require("supertest");
const app = require("../app");

describe("End to end test", () => {
  let token;

  // prep antes de empezar test
  beforeAll(async () => {});

  // prep después del test
  afterAll(async () => {});

  // ## etapa 1. validación de credenciales
  // autenticación
  test("should successfully verify a users", async () => {
    const userCredentials = {
      providerid: "leo.tiny",
      password: "hola123",
    };
    const res = await request(app)
      .post("/api/authenticate")
      .send(userCredentials);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  // ## etapa 2. proyectos, aplicaciones & notificaciones
  // todo : agregar ciclos de vida post y delete para sus respectivas pruebas
  // fetch de proyectos
  test("should fetch all projects in the db", async () => {
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
      .get("/api/aplicaciones/proyecto/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // fetch de todas las aplicaciones de cierto usuario
  test("should return applications of a certain project with status 200", async () => {
    const response = await request(app)
      .get("/api/aplicaciones/usuario/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // fetch de todos los roles
  test("should return all roles with status 200", async () => {
    const response = await request(app)
      .get("/api/roles")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // fetch de cierto rol bajo cierto id
  test("should return a role by id with status 200", async () => {
    const response = await request(app)
      .get("/api/roles")
      .send({ id_rol: "1" })
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  // ## etapa 3. skills, perfil

  // fetch de usuario
  test("should return the user information", async () => {
    const response = await request(app)
      .get("/api/usuario/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // fetch del feedback usuario 
  test("should return the user feedback", async () => {
    const response = await request(app)
      .get("/api/feedback/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // fetch de las skills técnicas
  test("should return the technical skills with status 200", async () => {
    const response = await request(app)
      .get("/api/habilidades/por-tipo")
      .send({
        isTechnical: true,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // fetch de las skills no técnicas
  test("should return the non-technical skills with status 200", async () => {
    const response = await request(app)
      .get("/api/habilidades/por-tipo")
      .send({
        isTechnical: false,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // fetch de todas las metas de cierto usuario
  test("should return all goals of the user with status 200", async () => {
    const response = await request(app)
      .get("/api/goals")
      .set("Authorization", `Bearer ${token}`)
      .send({ id_usuario: "1" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // fetch de cierta meta de cierto usuario
  test("should return a goal by id with status 200", async () => {
    const response = await request(app)
      .get("/api/goals")
      .set("Authorization", `Bearer ${token}`)
      .send({ id_goal: "2" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
