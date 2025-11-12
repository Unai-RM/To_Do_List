module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nick: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      comment: '0=superadmin, 1=empresa, 2=gestor, 3=usuario'
    },
    id_company: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID of the company the user belongs to'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscored: false
  });

  return User;
};
