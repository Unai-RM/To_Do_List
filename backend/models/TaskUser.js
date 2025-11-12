module.exports = (sequelize, DataTypes) => {
  const TaskUser = sequelize.define('TaskUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'task_id'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    }
  }, {
    tableName: 'task_users',
    timestamps: true
  });

  return TaskUser;
};
