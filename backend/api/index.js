import app from '../src/app.js';
import { sequelize } from '../src/models/index.js';

// Auto-sync database tables on serverless cold start if needed
let isConnected = false;

async function ensureDb() {
  if (!isConnected) {
    try {
      await sequelize.authenticate();
      await sequelize.sync(); // Ensures Todos table exists on Supabase PostgreSQL
      isConnected = true;
    } catch (err) {
      console.error('Vercel Serverless DB Sync Error:', err);
    }
  }
}

export default async function handler(req, res) {
  await ensureDb();
  return app(req, res);
}
