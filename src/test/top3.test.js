const request = require("supertest");
const app = require("../app");

describe("api/top3/get", () => {
  let token;

  // prep antes de empezar test
  beforeAll(async () => {});

  // prep después del test
  afterAll(async () => {});


  test("should return something", async () => {
    const res = await request(app)
      .get("/api/projects/top/15")
      // .send(userCredentials);

    expect(res.statusCode).toBe(200);
  });
});
