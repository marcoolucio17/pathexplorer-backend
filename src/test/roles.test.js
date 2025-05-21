const request = require('supertest');
const app = require('../app');
const { text } = require('express');

describe('api/roles/get', () => { 
    test('Should return all roles with status 200', async () => {
        const response = await request(app).get('/api/roles');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test('Should return a role by id with status 200', async () => {
        const response = await request(app).get('/api/roles').send({ id_rol: '1' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });
});

describe('api/roles/post', () => { 
    test('Should create a new role with status 201', async () => {
        const newRole = {
            "informacion": {
                "role": {
                    "nombrerol": "Developer Frontend Sr",
                    "nivelrol": 5,
                    "descripcionrol": "Conocimiento y experiencia previa con el uso de HTML",
                    "disponible": true
                }
            }
        };
        const response = await request(app).post('/api/roles').send(newRole);
        expect(response.statusCode).toBe(201);
    });

    test('Should create a new requirement with status 201', async () => {
        const newRequirement = {
                "id_rol": 107,
                "requerimiento": {
                    "idhabilidad": 5,
                    "tiempoexperiencia": "5 meses con"
                }
            
        };

        const response = await request(app).post('/api/roles').send(newRequirement);
        expect(response.statusCode).toBe(201);
    });
});

describe('api/roles/patch', () => { 


    test('Should update a role with status 200', async () => {
        const updatedRole = {
            "id_rol": 1,
            "role": {
                "nombrerol": "Developer Frontend Sr",
                "nivelrol": 5,
                "descripcionrol": "Conocimiento y experiencia previa con el uso de HTML",
                "disponible": true
            } 
            
        };
        
        const response = await request(app).patch('/api/roles').send(updatedRole);
        expect(response.statusCode).toBe(200);
    });
});

describe('api/roles/delete', () => { 
    test('Should delete a requirement from a role with status 200', async () => {
        const response = await request(app).delete('/api/roles').send({ id_rol: '2',id_requerimiento: '4'});
        expect(response.statusCode).toBe(200);
    });

    test('Should delete a role from a proyect with status 200', async () => {

        const deleteRole = {
            "id_rol": 101,
            "id_proyecto": 73,
            "requerimientos":
                [
                    {
                        "idrequerimiento": 120
                    },
                    {
                        "idrequerimiento": 121
                    },
                    {
                        "idrequerimiento": 122
                    }
                ]
        };
        const response = await request(app).delete('/api/roles').send(deleteRole);
        expect(response.statusCode).toBe(200);
    });
});