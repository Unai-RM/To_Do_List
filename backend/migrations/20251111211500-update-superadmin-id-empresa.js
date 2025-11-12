'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Asegurar que todos los superadmin tengan id_empresa = null
    await queryInterface.sequelize.query(
      'UPDATE users SET id_empresa = NULL WHERE role = 0'
    );
  },

  async down (queryInterface, Sequelize) {
    // No hay rollback necesario
  }
};
