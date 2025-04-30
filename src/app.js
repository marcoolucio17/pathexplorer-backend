const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 
const projectRoutes = require('./routes/projectsRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const certificatesRoutes = require('./routes/certificatesRoutes');
const goalsRoutes = require('./routes/goalsRoutes'); 
const rolesRoutes = require('./routes/rolesRoutes'); // Importa las rutas de roles
const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api', userRoutes); 
app.use('/api', projectRoutes);
app.use('/api',skillsRoutes);
app.use('/api',certificatesRoutes);
app.use('/api',goalsRoutes);
app.use('/api', rolesRoutes); 
app.get('/', (req, res) => {
  res.send('API is running...2');
});

module.exports = app;
