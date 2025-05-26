const request = require('supertest');
const app = require('../app');

describe('api/notifications', () => {

  test('Should create a new notification with status 201', async () => {
    const nuevaNotificacion = {
      idusuario: 33,
      titulo: "Test de notificación",
      mensaje: "Este es un mensaje de prueba"
    };
    const response = await request(app)
      .post('/api/notifications/send')
      .send(nuevaNotificacion);

    expect(response.statusCode).toBe(201);
  });

  test('Should get notifications for user with id 33', async () => {
    const response = await request(app)
      .get('/api/notifications/33');

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

});
