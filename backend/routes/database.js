const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/databaseController');

// Ruta para limpiar toda la base de datos
router.delete('/clean', databaseController.cleanDatabase);

// Ruta para resetear la base de datos (limpiar y preparar para seeders)
router.post('/reset', databaseController.resetDatabase);

module.exports = router;
