const bcrypt = require('bcrypt');
const { User } = require('../models');

const authController = {
  // Registro de usuario
  async register(req, res) {
    try {
      const { nick, password, name, surname } = req.body;

      // Validar campos requeridos
      if (!nick || !password || !name || !surname) {
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

      // Crear usuario
      const now = new Date();
      const newUser = await User.create({
        nick,
        password: hashedPassword,
        name,
        surname,
        createdAt: now,
        updatedAt: now
      });

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          nick: newUser.nick,
          name: newUser.name,
          surname: newUser.surname
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ 
        message: 'Error al registrar usuario',
        error: error.message 
      });
    }
  },

  // Login de usuario
  async login(req, res) {
    try {
      const { nick, password } = req.body;

      // Validar campos requeridos
      if (!nick || !password) {
        return res.status(400).json({ 
          message: 'Nick y contraseña son requeridos' 
        });
      }

      // Buscar usuario
      const user = await User.findOne({ where: { nick } });
      if (!user) {
        return res.status(401).json({ 
          message: 'Credenciales inválidas' 
        });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          message: 'Credenciales inválidas' 
        });
      }

      // Generar token (por ahora simple, luego puedes usar JWT)
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          nick: user.nick,
          name: user.name,
          surname: user.surname
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ 
        message: 'Error al iniciar sesión',
        error: error.message 
      });
    }
  }
};

module.exports = authController;
