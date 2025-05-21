const request = require('supertest');
const app = require('../app');


describe('api/goals/get', () => { 

    test('Should return all goals of the user with status 200', async () => {
        const response = await request(app).get('/api/goals').send({ id_usuario: '1' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test('Should return a goal by id with status 200', async () => {
        const response = await request(app).get('/api/goals').send({ id_goal: '2' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });
});

describe('api/goals/post', () => { 

    test('Should create a new goal with status 201', async () => {
        const newGoal = {
            "informacion": {
                "goal": {
                    "meta": "Meta de prueba",
                    "plazo": "2027-01-04",
                    "idusuario": 1
                }
            }
        };
        const response = await request(app).post('/api/goals').send(newGoal);
        expect(response.statusCode).toBe(201);
    });
});

describe('api/goals/patch', () => { 

    test('Should update a goal with status 200', async () => {
        const updatedGoal = {
            "idmeta": 1,
            "informacion": {
                "goal": {
                    "meta": "Meta actualizada",
                    "plazo": "2027-01-04"
                }
            }
        };
        
        const response = await request(app).patch('/api/goals').send(updatedGoal);
        expect(response.statusCode).toBe(200);
    });
});

describe('api/goals/delete', () => { 

    test('Should delete a goal with status 200', async () => {
        const response = await request(app).delete('/api/goals').send({ id_goal: '2' });
        expect(response.statusCode).toBe(200);
    });
});