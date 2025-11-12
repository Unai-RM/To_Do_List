const { Sequelize } = require('sequelize');
const config = require('./config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false
  }
);

async function cleanDatabase() {
  try {
    console.log('🗑️  Limpiando base de datos...\n');
    
    // Desactivar foreign key checks temporalmente
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('✓ Foreign key checks desactivados');

    // Truncar todas las tablas en orden
    await sequelize.query('TRUNCATE TABLE task_users');
    console.log('✓ Tabla task_users limpiada');
    
    await sequelize.query('TRUNCATE TABLE user_groups');
    console.log('✓ Tabla user_groups limpiada');
    
    await sequelize.query('TRUNCATE TABLE tasks');
    console.log('✓ Tabla tasks limpiada');
    
    await sequelize.query('TRUNCATE TABLE groups');
    console.log('✓ Tabla groups limpiada');
    
    await sequelize.query('TRUNCATE TABLE users');
    console.log('✓ Tabla users limpiada');
    
    await sequelize.query('TRUNCATE TABLE companies');
    console.log('✓ Tabla companies limpiada');

    // Reactivar foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ Foreign key checks reactivados');

    console.log('\n✅ Base de datos limpiada exitosamente!');
    console.log('\n📝 Para cargar datos de demostración ejecuta:');
    console.log('   npm run db:seed\n');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al limpiar la base de datos:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

cleanDatabase();
