import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import todoModel from './todo.js';

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Supabase PostgreSQL Connection
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // Local SQLite Fallback Connection
  const dbStorage = process.env.DB_STORAGE || './database.sqlite';
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbStorage,
    logging: false
  });
}

const Todo = todoModel(sequelize);

const db = {
  sequelize,
  Sequelize,
  Todo
};

export { sequelize, Todo };
export default db;
