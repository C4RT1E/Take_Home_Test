import app from '../src/app.js';
import prisma from '../src/lib/prisma.js';

export default async function handler(req, res) {
  try {
    await prisma.$connect();
  } catch (err) {
    console.error('Prisma Vercel Serverless Connection Error:', err);
  }
  return app(req, res);
}
