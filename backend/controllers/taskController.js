const { Task, User, sequelize } = require('../models');
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

      // Obtener información del usuario para verificar su rol y empresa
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      let tasks;

      // Si es empresa (rol 1) o gestor (rol 2), mostrar todas las tareas de su empresa
      if ((user.role === 1 || user.role === 2) && user.id_company) {
        // Obtener todos los usuarios de la misma empresa
        const companyUsers = await User.findAll({
          where: { id_company: user.id_company },
          attributes: ['id']
        });
        
        const companyUserIds = companyUsers.map(u => u.id);
        
        // Obtener todas las tareas creadas por usuarios de la empresa
        tasks = await Task.findAll({
          where: {
            id_user_creator: {
              [Sequelize.Op.in]: companyUserIds
            }
          },
          order: [['createdAt', 'DESC']]
        });
      } else {
        // Para usuarios normales, solo sus tareas
        tasks = await Task.findAll({
          where: {
            id_user_creator: userId
          },
          order: [['createdAt', 'DESC']]
        });
      }

      // Agregar el nombre del creador y usuarios asignados a cada tarea
      const tasksWithDetails = await Promise.all(tasks.map(async (task) => {
        const creator = await User.findByPk(task.id_user_creator, {
          attributes: ['name', 'surname']
        });
        
        // Obtener usuarios asignados desde task_users
        const assignedUsers = await sequelize.query(
          `SELECT u.id, u.name, u.surname 
           FROM task_users tu 
           INNER JOIN users u ON tu.user_id = u.id 
           WHERE tu.task_id = :taskId`,
          {
            replacements: { taskId: task.id },
            type: Sequelize.QueryTypes.SELECT
          }
        );
        
        return {
          ...task.toJSON(),
          creator_name: creator ? `${creator.name} ${creator.surname}` : 'Desconocido',
          assigned_users: assignedUsers.map(u => ({
            id: u.id,
            name: u.name,
            surname: u.surname
          }))
        };
      }));

      res.json(tasksWithDetails);
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

      // Obtener el nombre del creador
      const creator = await User.findByPk(id_user_creator, {
        attributes: ['name', 'surname']
      });

      const taskWithCreator = {
        ...newTask.toJSON(),
        creator_name: creator ? `${creator.name} ${creator.surname}` : 'Desconocido'
      };

      res.status(201).json(taskWithCreator);
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
  },

  // Actualizar usuarios asignados a una tarea
  async updateTaskUsers(req, res) {
    try {
      const { id } = req.params;
      const { userIds } = req.body;

      if (!Array.isArray(userIds)) {
        return res.status(400).json({ message: 'userIds debe ser un array' });
      }

      // Eliminar asignaciones existentes
      await sequelize.query(
        'DELETE FROM task_users WHERE task_id = :taskId',
        {
          replacements: { taskId: id },
          type: Sequelize.QueryTypes.DELETE
        }
      );

      // Agregar nuevas asignaciones
      if (userIds.length > 0) {
        const values = userIds.map(userId => `(${id}, ${userId})`).join(',');
        await sequelize.query(
          `INSERT INTO task_users (task_id, user_id) VALUES ${values}`,
          { type: Sequelize.QueryTypes.INSERT }
        );
      }

      res.json({ message: 'Usuarios actualizados correctamente' });
    } catch (error) {
      console.error('Error al actualizar usuarios:', error);
      res.status(500).json({ 
        message: 'Error al actualizar usuarios asignados',
        error: error.message 
      });
    }
  }
};

module.exports = taskController;
