const request = require("supertest");
const app = require("../app");

describe("api/top3/get", () => {
  const userCredentials = {
    providerid: "antonio.sosa",
    password: "hola123",
  };

  let token;

  test("should return 200 and a token on successful login", async () => {
    const res = await request(app)
      .post("/api/authenticate")
      .send(userCredentials);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("should return top 3 projects", async () => {
    const res = await request(app)
      .get("/api/projects/top/15")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
