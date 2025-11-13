const bcrypt = require('bcrypt');
const { User, Company } = require('../models');

const userController = {
  // Obtener todos los usuarios
  async getAllUsers(req, res) {
    try {
      const { requesterId } = req.query;
      const { Op } = require('sequelize');
      
      let whereClause = {
        role: { [Op.ne]: 0 } // Excluir superadmin (rol 0)
      };

      // Si hay requesterId, filtrar por empresa
      if (requesterId) {
        const requester = await User.findByPk(requesterId);
        console.log('Requester:', requester?.toJSON());
        if (requester && requester.id_company) {
          whereClause.id_company = requester.id_company;
          // Si no es superadmin, excluir también empresas (rol 1) y a sí mismo
          if (requester.role !== 0) {
            whereClause.role = { [Op.notIn]: [0, 1] }; // Excluir superadmin y empresa
            whereClause.id = { [Op.ne]: parseInt(requesterId) }; // Excluir a sí mismo
          }
        }
      }
      
      console.log('Where clause:', whereClause);

      const users = await User.findAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });

      // Enriquecer con nombre de empresa desde tabla companies
      const usersWithCompany = await Promise.all(users.map(async (user) => {
        const userData = user.toJSON();
        if (userData.id_company) {
          const company = await Company.findByPk(userData.id_company, {
            attributes: ['name']
          });
          userData.company_display = company?.name || 'N/A';
        } else {
          userData.company_display = 'N/A';
        }
        return userData;
      }));

      res.json(usersWithCompany);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ 
        message: 'Error al obtener usuarios',
        error: error.message 
      });
    }
  },

  // Obtener usuarios por rol
  async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      const { requesterId } = req.query;
      
      let whereClause = { 
        role: parseInt(role)
      };

      // Si hay requesterId y no es superadmin buscando empresas, filtrar por empresa
      if (requesterId && parseInt(role) !== 1) {
        const requester = await User.findByPk(requesterId);
        if (requester && requester.id_company) {
          whereClause.id_company = requester.id_company;
        }
      }

      const users = await User.findAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });

      // Enriquecer con nombre de empresa desde tabla companies
      const usersWithCompany = await Promise.all(users.map(async (user) => {
        const userData = user.toJSON();
        if (userData.id_company) {
          const company = await Company.findByPk(userData.id_company, {
            attributes: ['name']
          });
          userData.company_display = company?.name || 'N/A';
        } else {
          userData.company_display = 'N/A';
        }
        return userData;
      }));

      res.json(usersWithCompany);
    } catch (error) {
      console.error('Error al obtener usuarios por rol:', error);
      res.status(500).json({ 
        message: 'Error al obtener usuarios',
        error: error.message 
      });
    }
  },

  // Crear usuario
  async createUser(req, res) {
    try {
      const { nick, password, name, surname, role, creatorId, company_name } = req.body;

      // Validar campos requeridos
      if (!nick || !password || !name || !surname || role === undefined) {
        return res.status(400).json({ 
          message: 'Todos los campos son requeridos' 
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { nick } });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'El nombre de usuario ya está en uso' 
        });
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      let id_company = null;

      // Lógica de asignación de id_company
      if (role === 1) {
        // Crear usuario empresa
        const newUser = await User.create({
          nick,
          password: hashedPassword,
          name,
          surname,
          role,
          id_company: null, // Temporalmente null
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Crear registro en tabla companies
        const newCompany = await Company.create({
          name: company_name || `${name} ${surname}`,
          user_id: newUser.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Asignar el ID de la compañía al usuario
        await newUser.update({ id_company: newCompany.id });

        // Retornar usuario sin contraseña
        const userResponse = {
          id: newUser.id,
          nick: newUser.nick,
          name: newUser.name,
          surname: newUser.surname,
          role: newUser.role,
          id_company: newCompany.id,
          company_display: newCompany.name,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        };

        return res.status(201).json(userResponse);
      } else {
        // Para gestor (2) o usuario (3), heredar id_company del creador
        if (creatorId) {
          const creator = await User.findByPk(creatorId);
          if (creator) {
            id_company = creator.id_company;
          }
        }

        // Crear usuario con id_company heredado
        const newUser = await User.create({
          nick,
          password: hashedPassword,
          name,
          surname,
          role,
          id_company,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Retornar usuario sin contraseña
        const userResponse = {
          id: newUser.id,
          nick: newUser.nick,
          name: newUser.name,
          surname: newUser.surname,
          role: newUser.role,
          id_company: newUser.id_company,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        };

        res.status(201).json(userResponse);
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ 
        message: 'Error al crear usuario',
        error: error.message 
      });
    }
  },

  // Actualizar usuario
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { nick, password, name, surname, role } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Preparar datos de actualización
      const { company_name } = req.body;
      const updateData = {
        nick: nick || user.nick,
        name: name || user.name,
        surname: surname || user.surname,
        role: role !== undefined ? role : user.role,
        updatedAt: new Date()
      };

      // Si se proporciona nueva contraseña, encriptarla
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await user.update(updateData);

      // Si es empresa y se proporciona company_name, actualizar en tabla companies
      if (user.role === 1 && company_name !== undefined && user.id_company) {
        await Company.update(
          { name: company_name, updatedAt: new Date() },
          { where: { id: user.id_company } }
        );
      }

      // Retornar usuario sin contraseña
      const userResponse = {
        id: user.id,
        nick: user.nick,
        name: user.name,
        surname: user.surname,
        role: user.role,
        id_company: user.id_company,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json(userResponse);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ 
        message: 'Error al actualizar usuario',
        error: error.message 
      });
    }
  },

  // Eliminar usuario
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      await user.destroy();

      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ 
        message: 'Error al eliminar usuario',
        error: error.message 
      });
    }
  },

  // Cambiar contraseña
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      // Validar campos requeridos
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          message: 'La contraseña actual y la nueva contraseña son requeridas' 
        });
      }

      // Validar longitud mínima de la nueva contraseña
      if (newPassword.length < 6) {
        return res.status(400).json({ 
          message: 'La nueva contraseña debe tener al menos 6 caracteres' 
        });
      }

      // Buscar usuario
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verificar contraseña actual
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
      }

      // Encriptar nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar contraseña
      await user.update({
        password: hashedPassword,
        updatedAt: new Date()
      });

      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json({ 
        message: 'Error al cambiar contraseña',
        error: error.message 
      });
    }
  },

  // Actualizar preferencias de notificaciones
  async updateNotificationPreferences(req, res) {
    try {
      const { id } = req.params;
      const { notifications_enabled } = req.body;

      // Validar que se proporcione el campo
      if (notifications_enabled === undefined) {
        return res.status(400).json({ 
          message: 'El campo notifications_enabled es requerido' 
        });
      }

      // Buscar usuario
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Actualizar preferencias
      await user.update({
        notifications_enabled: notifications_enabled,
        updatedAt: new Date()
      });

      res.json({ 
        message: 'Preferencias de notificaciones actualizadas exitosamente',
        notifications_enabled: user.notifications_enabled
      });
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      res.status(500).json({ 
        message: 'Error al actualizar preferencias',
        error: error.message 
      });
    }
  }
};

module.exports = userController;
