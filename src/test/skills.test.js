const request = require("supertest");
const app = require("../app");

describe("Feedback API", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/authenticate")
      .send({
        providerid: "antonio.sosa",
        password: "hola123",
      });

    token = res.body.token;
  });

  //  Test 1: Obtener feedbacks para un usuario válido
  test("should return feedbacks for a user", async () => {
    const userId = 2; // cambia si necesitas otro

    const res = await request(app)
      .get(`/api/feedback/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("feedbacks");
    expect(Array.isArray(res.body.feedbacks)).toBe(true);

    if (res.body.feedbacks.length > 0) {
      const fb = res.body.feedbacks[0];
      expect(fb).toHaveProperty("feedback");
      expect(fb).toHaveProperty("rating");
      expect(fb).toHaveProperty("fecha");
    }
  });

  //  Test 2: Sin token debe devolver 401
  test("should return 401 if token is missing", async () => {
    const res = await request(app).get("/api/feedback/2");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
