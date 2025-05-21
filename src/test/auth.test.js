const request = require('supertest');
const app = require('../app'); 

describe('Authentication', () => {

    const userCredentials = {
        providerid: 'antonio.sosa',
        password: 'hola123'
    };

    const incorrectCredentials = {
        providerid: 'antonio.sosa',
        password: 'hola12'
    }

    // prep antes de empezar test
    beforeAll(async () => {
        
    });

    // prep después del test
    afterAll(async () => {
    });

    test('should return 200 and a token on successful login', async () => {
        const res = await request(app)
            .post('/api/authenticate')
            .send(userCredentials);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('should return 400 or 401 on login with incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/authenticate')
            .send(incorrectCredentials);

        expect([400, 401]).toContain(res.statusCode);
        expect(res.body).not.toHaveProperty('token');
    });
});