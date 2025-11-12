const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.patch('/:id/users', taskController.updateTaskUsers);
router.patch('/:id/archive', taskController.archiveTask);
router.patch('/:id/unarchive', taskController.unarchiveTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
