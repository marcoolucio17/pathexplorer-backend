const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 
const errorHandler = require('./middlewares/errorHandler');
const projectRoutes = require('./routes/projectsRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const certificatesRoutes = require('./routes/certificatesRoutes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // esto es para que permita a la página web demo (en prod final no debe de salir)
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
};

app.use(cors(corsOptions));
app.use(express.json()); 

app.use('/api', userRoutes); 
app.use(errorHandler);
app.use('/api', projectRoutes);
app.use('/api',skillsRoutes);
app.use('/api',certificatesRoutes);

app.get('/', (req, res) => {
  res.send('API is running...2');
});

module.exports = app;
