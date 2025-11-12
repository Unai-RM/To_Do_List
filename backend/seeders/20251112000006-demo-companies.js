'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('companies', [
      {
        id: 1,
        name: 'TechCorp Solutions S.L.',
        user_id: 2, // Usuario techcorp
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'InnovaSoft Digital Agency',
        user_id: 3, // Usuario innovasoft
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'DataFlow Analytics Inc.',
        user_id: 4, // Usuario dataflow
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies', null, {});
  }
};
