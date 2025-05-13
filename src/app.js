const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 
const errorHandler = require('./middlewares/errorHandler');
const projectRoutes = require('./routes/projectsRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const certificatesRoutes = require('./routes/certificatesRoutes');
const authenticationRoutes = require('./routes/authRoutes');
const notificationRoutes =  require('./routes/notificationRoutes');

const appsRoutes = require('./routes/appsRoutes'); //Apps route Axel

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
app.use('/api', skillsRoutes);
app.use('/api', certificatesRoutes);
app.use('/api', authenticationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api', appsRoutes); 

app.get('/', (req, res) => {
  res.send('Welcome to the PathExplorer API!! Read our documentation to learn about how to use our different endpoints.');
});

module.exports = app;
