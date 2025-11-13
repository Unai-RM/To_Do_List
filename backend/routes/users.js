const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas de usuarios
router.get('/', userController.getAllUsers);
router.get('/role/:role', userController.getUsersByRole);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.put('/:id/change-password', userController.changePassword);
router.put('/:id/notifications', userController.updateNotificationPreferences);
router.delete('/:id', userController.deleteUser);

module.exports = router;
