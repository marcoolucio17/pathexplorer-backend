const request = require("supertest");
const app = require("../app");

describe("api/projects/get", () => {
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
  //Paso
  test("Should return all projects with their roles and status 200", async () => {
    const response = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  //Paso
  test("Should return a projects or a bunch of projects by name with status 200", async () => {
    const response = await request(app)
      .get("/api/projects")
      .send({ projectName: "Aplicación" })
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  //Paso
  test("Should return a project by id with status 200", async () => {
    const response = await request(app)
      .get("/api/projects")
      .send({ idproyecto: "1" })
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("api/projects/post", () => {
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
  //Paso
  test("Should create a new project with status 201", async () => {
    const newProject = {
      informacion: {
        proyect: {
          pnombre: "Aplicación web",
          descripcion: "El pepe",
          fechainicio: "2025-05-12",
          fechafin: "2027-01-04",
          idcliente: 1,
        },
        roles: [
          {
            nombrerol: "Developer Frontend Sr",
            nivelrol: 5,
            descripcionrol:
              "Conocimiento y experiencia previa con el uso de HTML",
            disponible: true,
            requerimientos: [
              {
                tiempoexperiencia: "0.4 meses con",
                idhabilidad: 6,
              },
              {
                tiempoexperiencia: "0.2 meses con",
                idhabilidad: 31,
              },
              {
                tiempoexperiencia: "0.6 meses con",
                idhabilidad: 90,
              },
            ],
          },
          {
            nombrerol: "Developer Backend Jr",
            nivelrol: 10,
            descripcionrol: "Pues que sepa diseñar lo básico",
            disponible: true,
            requerimientos: [
              {
                tiempoexperiencia: "0.5 meses con",
                idhabilidad: 2,
              },
              {
                tiempoexperiencia: "0.1 meses con",
                idhabilidad: 1,
              },
              {
                tiempoexperiencia: "0.2 meses con",
                idhabilidad: 70,
              },
            ],
          },
        ],
      },
    };
    const response = await request(app)
      .post("/api/projects")
      .send(newProject)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
  });
});

describe("api/projects/patch", () => {
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
  //Paso
  test("Should update a project with status 200", async () => {
    const idProyecto = 150;
    const updatedProject = {
      informacion: {
        proyect: {
          pnombre: "Aplicación web prueba",
        },
      },
    };
    const response = await request(app)
      .patch(`/api/projects?idproyecto=${idProyecto}`)
      .send(updatedProject)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});

describe("api/projects/endpoints projecto custom para leo", () => {
  let token;

  // Autenticación
  beforeAll(async () => {
    const userCredentials = {
      providerid: "antonio.sosa",
      password: "hola123",
    };
    const res = await request(app)
      .post("/api/authenticate")
      .send(userCredentials);

    token = res.body.token;
  });

  // Test 1: Proyecto por rol (estado + datos del rol)
  test("Should return a project with role details by role id", async () => {
    const idProyecto = 1;
    const idRol = 1;

    const res = await request(app)
      .get(`/api/${idProyecto}/por-rol/${idRol}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("idproyecto");
    expect(res.body).toHaveProperty("proyecto_roles");
    expect(Array.isArray(res.body.proyecto_roles)).toBe(true);
    expect(res.body.proyecto_roles.length).toBeGreaterThan(0);
    expect(res.body.proyecto_roles[0]).toHaveProperty("estado");
    expect(res.body.proyecto_roles[0]).toHaveProperty("roles");
    expect(res.body.proyecto_roles[0].roles).toHaveProperty("nombrerol");

  });

  // Test 2: Aplicaciones a proyectos creados por un usuario
  test("Should return all applications for all projects created by a user", async () => {
    const idUsuarioCreador = 1;

    const res = await request(app)
      .get(`/api/creador/${idUsuarioCreador}/aplicaciones`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("idaplicacion");
      expect(res.body[0]).toHaveProperty("usuario");
      expect(res.body[0]).toHaveProperty("roles");
    }
  });
});
