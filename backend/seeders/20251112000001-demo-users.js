'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('users', [
      // Empresas (rol 1)
      {
        id: 2,
        nick: 'techcorp',
        password: hashedPassword,
        name: 'TechCorp',
        surname: 'Solutions',
        role: 1,
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        nick: 'innovasoft',
        password: hashedPassword,
        name: 'InnovaSoft',
        surname: 'Digital',
        role: 1,
        id_company: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        nick: 'dataflow',
        password: hashedPassword,
        name: 'DataFlow',
        surname: 'Analytics',
        role: 1,
        id_company: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Gestores de TechCorp (rol 2)
      {
        id: 5,
        nick: 'mgarcia',
        password: hashedPassword,
        name: 'María',
        surname: 'García López',
        role: 2,
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        nick: 'jmartinez',
        password: hashedPassword,
        name: 'Juan',
        surname: 'Martínez Ruiz',
        role: 2,
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Usuarios de TechCorp (rol 3)
      {
        id: 7,
        nick: 'alopez',
        password: hashedPassword,
        name: 'Ana',
        surname: 'López Fernández',
        role: 3,
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        nick: 'crodriguez',
        password: hashedPassword,
        name: 'Carlos',
        surname: 'Rodríguez Pérez',
        role: 3,
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        nick: 'lsanchez',
        password: hashedPassword,
        name: 'Laura',
        surname: 'Sánchez Gómez',
        role: 3,
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        nick: 'dmoreno',
        password: hashedPassword,
        name: 'David',
        surname: 'Moreno Torres',
        role: 3,
        id_company: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Gestores de InnovaSoft (rol 2)
      {
        id: 11,
        nick: 'pjimenez',
        password: hashedPassword,
        name: 'Patricia',
        surname: 'Jiménez Vega',
        role: 2,
        id_company: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Usuarios de InnovaSoft (rol 3)
      {
        id: 12,
        nick: 'rdiaz',
        password: hashedPassword,
        name: 'Roberto',
        surname: 'Díaz Castro',
        role: 3,
        id_company: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 13,
        nick: 'smartin',
        password: hashedPassword,
        name: 'Sofía',
        surname: 'Martín Herrera',
        role: 3,
        id_company: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 14,
        nick: 'jgonzalez',
        password: hashedPassword,
        name: 'Jorge',
        surname: 'González Ramos',
        role: 3,
        id_company: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Gestor de DataFlow (rol 2)
      {
        id: 15,
        nick: 'eruiz',
        password: hashedPassword,
        name: 'Elena',
        surname: 'Ruiz Navarro',
        role: 2,
        id_company: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Usuarios de DataFlow (rol 3)
      {
        id: 16,
        nick: 'malvarez',
        password: hashedPassword,
        name: 'Miguel',
        surname: 'Álvarez Ortiz',
        role: 3,
        id_company: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 17,
        nick: 'cromero',
        password: hashedPassword,
        name: 'Carmen',
        surname: 'Romero Silva',
        role: 3,
        id_company: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 18,
        nick: 'fcastro',
        password: hashedPassword,
        name: 'Francisco',
        surname: 'Castro Molina',
        role: 3,
        id_company: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
