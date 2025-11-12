'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      // Tareas de TechCorp
      // Pendientes (status 0)
      {
        id: 1,
        title: 'Implementar autenticación OAuth',
        description: 'Integrar sistema de autenticación con Google y GitHub OAuth 2.0',
        status: 0,
        id_user_creator: 5,
        createdAt: new Date('2024-11-10'),
        updatedAt: new Date('2024-11-10')
      },
      {
        id: 2,
        title: 'Diseñar mockups de dashboard',
        description: 'Crear diseños de alta fidelidad para el nuevo dashboard de analytics',
        status: 0,
        id_user_creator: 7,
        createdAt: new Date('2024-11-11'),
        updatedAt: new Date('2024-11-11')
      },
      {
        id: 3,
        title: 'Configurar pipeline CI/CD',
        description: 'Establecer pipeline automatizado con GitHub Actions para testing y deployment',
        status: 0,
        id_user_creator: 10,
        createdAt: new Date('2024-11-11'),
        updatedAt: new Date('2024-11-11')
      },
      
      // En progreso (status 1)
      {
        id: 4,
        title: 'Desarrollar API de usuarios',
        description: 'Crear endpoints RESTful para gestión completa de usuarios (CRUD)',
        status: 1,
        id_user_creator: 8,
        createdAt: new Date('2024-11-08'),
        updatedAt: new Date('2024-11-12')
      },
      {
        id: 5,
        title: 'Optimizar queries de base de datos',
        description: 'Revisar y optimizar consultas SQL lentas, agregar índices necesarios',
        status: 1,
        id_user_creator: 6,
        createdAt: new Date('2024-11-09'),
        updatedAt: new Date('2024-11-12')
      },
      {
        id: 6,
        title: 'Implementar sistema de notificaciones',
        description: 'Desarrollar sistema de notificaciones en tiempo real con WebSockets',
        status: 1,
        id_user_creator: 9,
        createdAt: new Date('2024-11-10'),
        updatedAt: new Date('2024-11-12')
      },
      
      // En revisión (status 2)
      {
        id: 7,
        title: 'Migrar a TypeScript',
        description: 'Convertir proyecto de JavaScript a TypeScript para mejor type safety',
        status: 2,
        id_user_creator: 7,
        createdAt: new Date('2024-11-05'),
        updatedAt: new Date('2024-11-11')
      },
      {
        id: 8,
        title: 'Crear tests unitarios para servicios',
        description: 'Escribir suite completa de tests con Jest para todos los servicios',
        status: 2,
        id_user_creator: 8,
        createdAt: new Date('2024-11-06'),
        updatedAt: new Date('2024-11-11')
      },
      
      // En testing (status 3)
      {
        id: 9,
        title: 'Implementar caché con Redis',
        description: 'Agregar capa de caché con Redis para mejorar performance',
        status: 3,
        id_user_creator: 6,
        createdAt: new Date('2024-11-03'),
        updatedAt: new Date('2024-11-10')
      },
      {
        id: 10,
        title: 'Refactorizar componentes React',
        description: 'Mejorar estructura de componentes y aplicar hooks personalizados',
        status: 3,
        id_user_creator: 9,
        createdAt: new Date('2024-11-04'),
        updatedAt: new Date('2024-11-10')
      },
      
      // Completadas (status 4)
      {
        id: 11,
        title: 'Configurar Docker containers',
        description: 'Crear Dockerfiles y docker-compose para desarrollo local',
        status: 4,
        id_user_creator: 10,
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-08')
      },
      {
        id: 12,
        title: 'Implementar validación de formularios',
        description: 'Agregar validación robusta en frontend con Formik y Yup',
        status: 4,
        id_user_creator: 7,
        createdAt: new Date('2024-11-02'),
        updatedAt: new Date('2024-11-09')
      },
      
      // Tareas de InnovaSoft
      {
        id: 13,
        title: 'Rediseñar landing page',
        description: 'Crear nuevo diseño moderno y responsive para la página principal',
        status: 0,
        id_user_creator: 13,
        createdAt: new Date('2024-11-11'),
        updatedAt: new Date('2024-11-11')
      },
      {
        id: 14,
        title: 'Campaña de email marketing',
        description: 'Diseñar y programar campaña de email para lanzamiento de producto',
        status: 1,
        id_user_creator: 12,
        createdAt: new Date('2024-11-09'),
        updatedAt: new Date('2024-11-12')
      },
      {
        id: 15,
        title: 'Optimizar SEO del sitio web',
        description: 'Mejorar meta tags, estructura de URLs y contenido para SEO',
        status: 2,
        id_user_creator: 12,
        createdAt: new Date('2024-11-07'),
        updatedAt: new Date('2024-11-11')
      },
      {
        id: 16,
        title: 'Crear guía de estilo de marca',
        description: 'Documentar colores, tipografías y elementos visuales de la marca',
        status: 4,
        id_user_creator: 13,
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-08')
      },
      
      // Tareas de DataFlow
      {
        id: 17,
        title: 'Modelo predictivo de ventas',
        description: 'Desarrollar modelo de machine learning para predecir ventas trimestrales',
        status: 0,
        id_user_creator: 16,
        createdAt: new Date('2024-11-11'),
        updatedAt: new Date('2024-11-11')
      },
      {
        id: 18,
        title: 'Dashboard de KPIs ejecutivos',
        description: 'Crear dashboard interactivo con Power BI para métricas clave',
        status: 1,
        id_user_creator: 17,
        createdAt: new Date('2024-11-09'),
        updatedAt: new Date('2024-11-12')
      },
      {
        id: 19,
        title: 'Pipeline de datos en tiempo real',
        description: 'Implementar pipeline con Apache Kafka para procesamiento en streaming',
        status: 1,
        id_user_creator: 18,
        createdAt: new Date('2024-11-08'),
        updatedAt: new Date('2024-11-12')
      },
      {
        id: 20,
        title: 'Análisis de comportamiento de usuarios',
        description: 'Realizar análisis exploratorio de datos de comportamiento en la app',
        status: 2,
        id_user_creator: 16,
        createdAt: new Date('2024-11-06'),
        updatedAt: new Date('2024-11-11')
      },
      {
        id: 21,
        title: 'Migrar data warehouse a Snowflake',
        description: 'Planificar y ejecutar migración de data warehouse a Snowflake',
        status: 3,
        id_user_creator: 18,
        createdAt: new Date('2024-11-04'),
        updatedAt: new Date('2024-11-10')
      },
      {
        id: 22,
        title: 'Automatizar reportes mensuales',
        description: 'Crear scripts para generación automática de reportes mensuales',
        status: 4,
        id_user_creator: 17,
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-07')
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};
