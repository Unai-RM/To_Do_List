'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Definir relaciones entre modelos
if (db.User && db.Group && db.UserGroup) {
  // Relación many-to-many entre User y Group a través de UserGroup
  db.User.belongsToMany(db.Group, {
    through: db.UserGroup,
    foreignKey: 'id_user',
    otherKey: 'id_group',
    as: 'groups'
  });

  db.Group.belongsToMany(db.User, {
    through: db.UserGroup,
    foreignKey: 'id_group',
    otherKey: 'id_user',
    as: 'users'
  });

  // Relación de Group con User (empresa que gestiona el grupo)
  db.Group.belongsTo(db.User, {
    foreignKey: 'id_company',
    as: 'company'
  });

  db.User.hasMany(db.Group, {
    foreignKey: 'id_company',
    as: 'managedGroups'
  });
}

// Relaciones con Company
if (db.User && db.Company) {
  // Un usuario (empresa) tiene una compañía
  db.User.hasOne(db.Company, {
    foreignKey: 'user_id',
    as: 'company'
  });

  // Una compañía pertenece a un usuario
  db.Company.belongsTo(db.User, {
    foreignKey: 'user_id',
    as: 'owner'
  });

  // Usuarios pertenecen a una compañía
  db.User.belongsTo(db.Company, {
    foreignKey: 'id_company',
    as: 'userCompany'
  });

  db.Company.hasMany(db.User, {
    foreignKey: 'id_company',
    as: 'employees'
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
