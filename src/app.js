const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 
const errorHandler = require('./middlewares/errorHandler');
const projectRoutes = require('./routes/projectsRoutes');
const goalsRoutes = require('./routes/goalsRoutes'); 
const rolesRoutes = require('./routes/rolesRoutes'); // Importa las rutas de roles
const skillsRoutes = require('./routes/skillsRoutes');
const appsRoutes = require('./routes/appsRoutes');
const certificationsRoutes = require('./routes/certificationsRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const authenticationRoutes = require('./routes/authRoutes');
const notificationRoutes =  require('./routes/notificationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const compabilityRoutes = require('./routes/compabilityRoutes');
const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const isLocalhost = origin === 'http://localhost:5173';
    const isVercel = /^https:\/\/.*\.vercel\.app$/.test(origin);

    if (!origin || isLocalhost || isVercel) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); 

app.use('/api', userRoutes); 
app.use(errorHandler);
app.use('/api', projectRoutes);
app.use('/api', certificationsRoutes);
app.use('/api', appsRoutes); 
app.use('/api/habilidades', skillsRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api', skillsRoutes);
app.use('/api', authenticationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api', appsRoutes); 
app.use('/api',goalsRoutes);
app.use('/api', rolesRoutes); 
app.use('/api/feedback', feedbackRoutes);
app.use('/api', compabilityRoutes); 

app.get('/', (req, res) => {
  res.send('Welcome to the PathExplorer API!! Read our documentation to learn about how to use our different endpoints.');
});

module.exports = app;
