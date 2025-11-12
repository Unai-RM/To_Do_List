'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'id_empresa', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'ID de la empresa a la que pertenece el usuario. Para empresas (rol 1), es su propio ID. Para gestores y usuarios, es el ID de su empresa padre.'
    });

    // Crear índice para mejorar consultas
    await queryInterface.addIndex('users', ['id_empresa'], {
      name: 'idx_users_id_empresa'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'idx_users_id_empresa');
    await queryInterface.removeColumn('users', 'id_empresa');
  }
};
