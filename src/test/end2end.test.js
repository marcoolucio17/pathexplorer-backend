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
      providerid: "axel.grande",
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
      .get("/api/projects?idCompatible=2")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // fetch de proyecto por id
  test("should return a project by id with status 200", async () => {
    const response = await request(app)
      .get("/api/projects?idproyecto=1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  // fetch de todas las aplicaciones en cierto proyecto
  test("should return applications in a certain project with status 200", async () => {
    const response = await request(app)
      .get("/api/apps/proyecto/2")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // fetch de todas las aplicaciones de cierto usuario
  test("should return applications of a certain user with status 200", async () => {
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

  test("should return all users with their project, role, and profile image", async () => {
    const response = await request(app)
      .get("/api/usuarios/total")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should return feedbacks of a user with status 200", async () => {
    const response = await request(app)
      .get("/api/feedback/2")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("feedbacks");
    expect(Array.isArray(response.body.feedbacks)).toBe(true);
  });

  test("should return full project information with status 200", async () => {
    const response = await request(app)
      .get("/api/1/completo")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("idproyecto");
    expect(response.body).toHaveProperty("cliente");
    expect(response.body).toHaveProperty("proyecto_roles");
    expect(response.body).toHaveProperty("utp");
  });

  test("should return project information filtered by role with status 200", async () => {
    const response = await request(app)
      .get("/api/1/por-rol/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("idproyecto");
    expect(response.body).toHaveProperty("proyecto_roles");
    expect(Array.isArray(response.body.proyecto_roles)).toBe(true);
  });

  test("should return signed URL for client photo with status 200", async () => {
  const response = await request(app)
    .get("/api/clientes/1/foto")
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("fotodecliente_url");
  expect(typeof response.body.fotodecliente_url).toBe("string");
  });

  test("should return signed URL for certification image with status 200", async () => {
    const response = await request(app)
      .get("/api/certificaciones/image-url/2")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("url");
    expect(typeof response.body.url).toBe("string");
  });

  test("should return signed URL for user profile photo with status 200", async () => {
    const response = await request(app)
      .get("/api/profile-url/2")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("url");
    expect(typeof response.body.url).toBe("string");
  });

  test("should return signed URL for user CV with status 200", async () => {
    const response = await request(app)
      .get("/api/cv-url/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("url");
    expect(typeof response.body.url).toBe("string");
  });

  test("should return signed URL for RFP document with status 200", async () => {
    const response = await request(app)
      .get("/api/1/rfp")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("url");
    expect(typeof response.body.url).toBe("string");
  });

  test("should return all skills with status 200", async () => {
  const response = await request(app)
    .get("/api/habilidades")
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
  if (response.body.length > 0) {
    expect(response.body[0]).toHaveProperty("idhabilidad");
    expect(response.body[0]).toHaveProperty("nombre");
    expect(response.body[0]).toHaveProperty("estecnica");
  }
  });

test("should return applications with status 'RolAsignado' and status 200", async () => {
  const response = await request(app)
    .get("/api/apps/estatus/RolAsignado")
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body.aplicaciones)).toBe(true);

  if (response.body.aplicaciones.length > 0) {
    const app = response.body.aplicaciones[0];

    expect(app).toHaveProperty("idaplicacion");
    expect(app).toHaveProperty("estatus", "RolAsignado");

    expect(app).toHaveProperty("usuario");
    expect(app.usuario).toHaveProperty("idusuario");
    expect(app.usuario).toHaveProperty("nombre");
    expect(app.usuario).toHaveProperty("fotodeperfil_url");

    expect(app).toHaveProperty("proyecto");
    expect(app.proyecto).toHaveProperty("nombre"); 
  }
  });


});
