import { PrismaClient } from '@prisma/client';

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    databaseUrl = 'file:/tmp/dev.db';
  } else {
    databaseUrl = 'file:./dev.db';
  }
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    });
  }
  prisma = global.prisma;
}

export default prisma;
