'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('task_users', [
      // Tarea 1: Implementar autenticación OAuth - Asignada a Ana y Laura
      { task_id: 1, user_id: 7, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 1, user_id: 9, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 2: Diseñar mockups - Asignada a Ana
      { task_id: 2, user_id: 7, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 3: Configurar pipeline - Asignada a David
      { task_id: 3, user_id: 10, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 4: Desarrollar API - Asignada a Carlos y Juan
      { task_id: 4, user_id: 8, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 4, user_id: 6, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 5: Optimizar queries - Asignada a Juan y David
      { task_id: 5, user_id: 6, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 5, user_id: 10, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 6: Sistema de notificaciones - Asignada a Laura y Ana
      { task_id: 6, user_id: 9, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 6, user_id: 7, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 7: Migrar a TypeScript - Asignada a Ana, Carlos y Laura
      { task_id: 7, user_id: 7, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 7, user_id: 8, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 7, user_id: 9, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 8: Tests unitarios - Asignada a Carlos y María
      { task_id: 8, user_id: 8, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 8, user_id: 5, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 9: Implementar caché - Asignada a Juan y David
      { task_id: 9, user_id: 6, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 9, user_id: 10, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 10: Refactorizar componentes - Asignada a Laura
      { task_id: 10, user_id: 9, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 11: Docker - Asignada a David
      { task_id: 11, user_id: 10, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 12: Validación formularios - Asignada a Ana
      { task_id: 12, user_id: 7, createdAt: new Date(), updatedAt: new Date() },
      
      // Tareas de InnovaSoft
      // Tarea 13: Rediseñar landing - Asignada a Sofía
      { task_id: 13, user_id: 13, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 14: Campaña email - Asignada a Roberto y Patricia
      { task_id: 14, user_id: 12, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 14, user_id: 11, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 15: Optimizar SEO - Asignada a Roberto
      { task_id: 15, user_id: 12, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 16: Guía de estilo - Asignada a Sofía
      { task_id: 16, user_id: 13, createdAt: new Date(), updatedAt: new Date() },
      
      // Tareas de DataFlow
      // Tarea 17: Modelo predictivo - Asignada a Miguel y Elena
      { task_id: 17, user_id: 16, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 17, user_id: 15, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 18: Dashboard KPIs - Asignada a Carmen
      { task_id: 18, user_id: 17, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 19: Pipeline tiempo real - Asignada a Francisco y Miguel
      { task_id: 19, user_id: 18, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 19, user_id: 16, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 20: Análisis comportamiento - Asignada a Miguel y Carmen
      { task_id: 20, user_id: 16, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 20, user_id: 17, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 21: Migrar Snowflake - Asignada a Francisco
      { task_id: 21, user_id: 18, createdAt: new Date(), updatedAt: new Date() },
      
      // Tarea 22: Automatizar reportes - Asignada a Carmen y Elena
      { task_id: 22, user_id: 17, createdAt: new Date(), updatedAt: new Date() },
      { task_id: 22, user_id: 15, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('task_users', null, {});
  }
};
