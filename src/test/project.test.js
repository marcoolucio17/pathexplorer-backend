const request = require('supertest');
const app = require('../app');

describe('api/projects/get', () => {
  //Paso
  test('Should return all projects with their roles and status 200', async () => {
    const response = await request(app).get('/api/projects');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  //Paso
  test('Should return a projects or a bunch of projects by name with status 200', async () => { 
    const response = await request(app).get('/api/projects').send({ projectName: 'Aplicación' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  //Paso
  test('Should return a project by id with status 200', async () => {
    const response = await request(app).get('/api/projects').send({ idproyecto: '1' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });


});
