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

describe('api/projects/post', () => { 
  //Paso
  test('Should create a new project with status 201', async () => {
    const newProject ={
    "informacion": {
        "proyect" : {
            "pnombre": "Aplicación web",
            "descripcion": "El pepe",
            "fechainicio": "2025-05-12",
            "fechafin": "2027-01-04",
            "idcliente": 1
        },
        "roles": [{
            "nombrerol": "Developer Frontend Sr",
            "nivelrol": 5,
            "descripcionrol": "Conocimiento y experiencia previa con el uso de HTML",
            "disponible": true,
            "requerimientos": [{
                "tiempoexperiencia": "0.4 meses con",
                "idhabilidad": 6
            },{
                "tiempoexperiencia": "0.2 meses con",
                "idhabilidad": 31
            },{
                "tiempoexperiencia": "0.6 meses con",
                "idhabilidad": 90
            }
            ]
        }, {
            "nombrerol": "Developer Backend Jr",
            "nivelrol": 10,
            "descripcionrol": "Pues que sepa diseñar lo básico",
            "disponible": true,
            "requerimientos": [{
                "tiempoexperiencia": "0.5 meses con",
                "idhabilidad": 2
            },{
                "tiempoexperiencia": "0.1 meses con",
                "idhabilidad": 1
            },{
                "tiempoexperiencia": "0.2 meses con",
                "idhabilidad": 70
            }
            ]
        }]
    }
    };
    const response = await request(app).post('/api/projects').send(newProject);
    expect(response.statusCode).toBe(201);
  });

});

describe('api/projects/patch', () => {
  //Paso
  test('Should update a project with status 200', async () => {
    const updatedProject = {
    "idproyecto": 46,
    "informacion": {
        "proyect" : {
            "pnombre": "Aplicación web prueba",
            "descripcion": "Realizar una aplicación web que permita gestionar la tienda Marcos Maximos",
            "fechainicio": "2025-05-12",
            "fechafin": "2027-01-04",
            "idcliente": 1
        }
    }
}
    const response = await request(app).patch('/api/projects').send(updatedProject);
    expect(response.statusCode).toBe(200);
   
  });
});