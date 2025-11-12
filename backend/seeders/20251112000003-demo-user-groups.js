'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_groups', [
      // TechCorp - Desarrollo Frontend (grupo 1)
      { id_user: 5, id_group: 1, createdAt: new Date(), updatedAt: new Date() },  // María (gestor)
      { id_user: 7, id_group: 1, createdAt: new Date(), updatedAt: new Date() },  // Ana
      { id_user: 9, id_group: 1, createdAt: new Date(), updatedAt: new Date() },  // Laura
      
      // TechCorp - Desarrollo Backend (grupo 2)
      { id_user: 6, id_group: 2, createdAt: new Date(), updatedAt: new Date() },  // Juan (gestor)
      { id_user: 8, id_group: 2, createdAt: new Date(), updatedAt: new Date() },  // Carlos
      { id_user: 10, id_group: 2, createdAt: new Date(), updatedAt: new Date() }, // David
      
      // TechCorp - DevOps (grupo 3)
      { id_user: 6, id_group: 3, createdAt: new Date(), updatedAt: new Date() },  // Juan (gestor)
      { id_user: 10, id_group: 3, createdAt: new Date(), updatedAt: new Date() }, // David
      
      // TechCorp - QA Testing (grupo 4)
      { id_user: 5, id_group: 4, createdAt: new Date(), updatedAt: new Date() },  // María (gestor)
      { id_user: 7, id_group: 4, createdAt: new Date(), updatedAt: new Date() },  // Ana
      { id_user: 8, id_group: 4, createdAt: new Date(), updatedAt: new Date() },  // Carlos
      
      // InnovaSoft - Diseño UX/UI (grupo 5)
      { id_user: 11, id_group: 5, createdAt: new Date(), updatedAt: new Date() }, // Patricia (gestor)
      { id_user: 13, id_group: 5, createdAt: new Date(), updatedAt: new Date() }, // Sofía
      
      // InnovaSoft - Marketing Digital (grupo 6)
      { id_user: 11, id_group: 6, createdAt: new Date(), updatedAt: new Date() }, // Patricia (gestor)
      { id_user: 12, id_group: 6, createdAt: new Date(), updatedAt: new Date() }, // Roberto
      
      // InnovaSoft - Desarrollo Web (grupo 7)
      { id_user: 12, id_group: 7, createdAt: new Date(), updatedAt: new Date() }, // Roberto
      { id_user: 14, id_group: 7, createdAt: new Date(), updatedAt: new Date() }, // Jorge
      
      // DataFlow - Data Science (grupo 8)
      { id_user: 15, id_group: 8, createdAt: new Date(), updatedAt: new Date() }, // Elena (gestor)
      { id_user: 16, id_group: 8, createdAt: new Date(), updatedAt: new Date() }, // Miguel
      { id_user: 17, id_group: 8, createdAt: new Date(), updatedAt: new Date() }, // Carmen
      
      // DataFlow - Business Intelligence (grupo 9)
      { id_user: 15, id_group: 9, createdAt: new Date(), updatedAt: new Date() }, // Elena (gestor)
      { id_user: 17, id_group: 9, createdAt: new Date(), updatedAt: new Date() }, // Carmen
      
      // DataFlow - Data Engineering (grupo 10)
      { id_user: 16, id_group: 10, createdAt: new Date(), updatedAt: new Date() }, // Miguel
      { id_user: 18, id_group: 10, createdAt: new Date(), updatedAt: new Date() }  // Francisco
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_groups', null, {});
  }
};
