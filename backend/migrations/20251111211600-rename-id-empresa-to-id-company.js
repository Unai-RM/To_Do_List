'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Renombrar columna id_empresa a id_company
    await queryInterface.renameColumn('users', 'id_empresa', 'id_company');
    
    // Renombrar índice
    await queryInterface.removeIndex('users', 'idx_users_id_empresa');
    await queryInterface.addIndex('users', ['id_company'], {
      name: 'idx_users_id_company'
    });
  },

  async down (queryInterface, Sequelize) {
    // Revertir cambios
    await queryInterface.removeIndex('users', 'idx_users_id_company');
    await queryInterface.renameColumn('users', 'id_company', 'id_empresa');
    await queryInterface.addIndex('users', ['id_empresa'], {
      name: 'idx_users_id_empresa'
    });
  }
};
