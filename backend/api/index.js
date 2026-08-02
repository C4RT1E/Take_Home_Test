import app from '../src/app.js';
import prisma from '../src/lib/prisma.js';
import fs from 'fs';
import path from 'path';

let isDbInitialized = false;

async function ensureDatabase() {
  if (!isDbInitialized) {
    try {
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        const localDb = path.resolve(process.cwd(), 'backend/prisma/dev.db');
        const rootLocalDb = path.resolve(process.cwd(), 'prisma/dev.db');
        const tmpDb = '/tmp/dev.db';

        if (!fs.existsSync(tmpDb)) {
          if (fs.existsSync(localDb)) {
            fs.copyFileSync(localDb, tmpDb);
          } else if (fs.existsSync(rootLocalDb)) {
            fs.copyFileSync(rootLocalDb, tmpDb);
          }
        }
      }
      await prisma.$connect();
      isDbInitialized = true;
    } catch (err) {
      console.error('Serverless DB auto-initializer error:', err);
    }
  }
}

export default async function handler(req, res) {
  await ensureDatabase();
  return app(req, res);
}
