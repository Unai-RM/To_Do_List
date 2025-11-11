const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de To Do List' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'El servidor está funcionando correctamente' });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de tareas
app.use('/api/tasks', taskRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
