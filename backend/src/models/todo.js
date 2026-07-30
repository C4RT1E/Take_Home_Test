import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Todo extends Model {}

  Todo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Title cannot be empty'
          }
        }
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Todo',
      tableName: 'Todos',
      timestamps: true
    }
  );

  return Todo;
};
