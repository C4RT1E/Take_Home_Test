import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import todoModel from './todo.js';

dotenv.config();

const dbStorage = process.env.DB_STORAGE || './database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbStorage,
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

const Todo = todoModel(sequelize);

const db = {
  sequelize,
  Sequelize,
  Todo
};

export { sequelize, Todo };
export default db;
