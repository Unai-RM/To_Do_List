'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'company_name', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Company name for users with role=1 (empresa)'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'company_name');
  }
};
