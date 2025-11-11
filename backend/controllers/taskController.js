const { Task } = require('../models');
const { Sequelize } = require('sequelize');

const taskController = {
  // Obtener todas las tareas del usuario
  async getAllTasks(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ 
          message: 'El ID del usuario es requerido' 
        });
      }

      // Por ahora solo filtramos por creador
      // Más adelante agregaremos la lógica de task_users
      const tasks = await Task.findAll({
        where: {
          id_user_creator: userId
        },
        order: [['createdAt', 'DESC']]
      });

      res.json(tasks);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      res.status(500).json({ 
        message: 'Error al obtener las tareas',
        error: error.message 
      });
    }
  },

  // Crear tarea
  async createTask(req, res) {
    try {
      const { title, description, status, id_user_creator } = req.body;

      if (!title || id_user_creator === undefined) {
        return res.status(400).json({ 
          message: 'El título y el creador son requeridos' 
        });
      }

      const now = new Date();
      const newTask = await Task.create({
        title,
        description: description || '',
        status: status !== undefined ? status : 0,
        id_user_creator,
        createdAt: now,
        updatedAt: now
      });

      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      res.status(500).json({ 
        message: 'Error al crear la tarea',
        error: error.message 
      });
    }
  },

  // Actualizar tarea completa
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      task.updatedAt = new Date();

      await task.save();
      res.json(task);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      res.status(500).json({ 
        message: 'Error al actualizar la tarea',
        error: error.message 
      });
    }
  },

  // Actualizar solo el estado de la tarea
  async updateTaskStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (status === undefined) {
        return res.status(400).json({ message: 'El estado es requerido' });
      }

      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      task.status = status;
      task.updatedAt = new Date();
      await task.save();

      res.json(task);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ 
        message: 'Error al actualizar el estado de la tarea',
        error: error.message 
      });
    }
  }
};

module.exports = taskController;
