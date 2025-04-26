const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 
const projectRoutes = require('./routes/projectsRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const certificatesRoutes = require('./routes/certificatesRoutes');
const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api', userRoutes); 
app.use('/api', projectRoutes);
app.use('/api',skillsRoutes);
app.use('/api',certificatesRoutes);

app.get('/', (req, res) => {
  res.send('API is running...2');
});

module.exports = app;
