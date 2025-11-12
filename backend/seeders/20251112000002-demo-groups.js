'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('groups', [
      // Grupos de TechCorp (empresa id: 2)
      {
        id: 1,
        name: 'Desarrollo Frontend',
        description: 'Equipo especializado en desarrollo de interfaces de usuario con React y Angular',
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Desarrollo Backend',
        description: 'Equipo de desarrollo de APIs y servicios con Node.js y Python',
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'DevOps',
        description: 'Equipo de infraestructura, CI/CD y despliegues',
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'QA Testing',
        description: 'Equipo de aseguramiento de calidad y testing automatizado',
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Grupos de InnovaSoft (empresa id: 3)
      {
        id: 5,
        name: 'Diseño UX/UI',
        description: 'Equipo de diseño de experiencia de usuario e interfaces',
        id_company: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Marketing Digital',
        description: 'Equipo de estrategias digitales y contenido',
        id_company: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: 'Desarrollo Web',
        description: 'Equipo de desarrollo de aplicaciones web y móviles',
        id_company: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Grupos de DataFlow (empresa id: 4)
      {
        id: 8,
        name: 'Data Science',
        description: 'Equipo de análisis de datos y machine learning',
        id_company: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        name: 'Business Intelligence',
        description: 'Equipo de reportes y visualización de datos',
        id_company: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        name: 'Data Engineering',
        description: 'Equipo de pipelines de datos y ETL',
        id_company: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('groups', null, {});
  }
};
