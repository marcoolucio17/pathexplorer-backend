const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api', userRoutes); 

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
