const { sequelize } = require('../models');

// Limpiar toda la base de datos
exports.cleanDatabase = async (req, res) => {
  try {
    // Desactivar foreign key checks temporalmente
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Truncar todas las tablas en orden
    await sequelize.query('TRUNCATE TABLE task_users');
    await sequelize.query('TRUNCATE TABLE user_groups');
    await sequelize.query('TRUNCATE TABLE tasks');
    await sequelize.query('TRUNCATE TABLE groups');
    await sequelize.query('TRUNCATE TABLE users');
    await sequelize.query('TRUNCATE TABLE companies');

    // Reactivar foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    res.json({ 
      success: true, 
      message: 'Base de datos limpiada exitosamente. Todas las tablas han sido vaciadas.' 
    });
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al limpiar la base de datos', 
      error: error.message 
    });
  }
};

// Resetear base de datos (limpiar y ejecutar seeders)
exports.resetDatabase = async (req, res) => {
  try {
    // Desactivar foreign key checks temporalmente
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Truncar todas las tablas
    await sequelize.query('TRUNCATE TABLE task_users');
    await sequelize.query('TRUNCATE TABLE user_groups');
    await sequelize.query('TRUNCATE TABLE tasks');
    await sequelize.query('TRUNCATE TABLE groups');
    await sequelize.query('TRUNCATE TABLE users');
    await sequelize.query('TRUNCATE TABLE companies');

    // Reactivar foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    res.json({ 
      success: true, 
      message: 'Base de datos reseteada. Ejecuta los seeders con: npx sequelize-cli db:seed:all' 
    });
  } catch (error) {
    console.error('Error al resetear la base de datos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al resetear la base de datos', 
      error: error.message 
    });
  }
};
