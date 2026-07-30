import dotenv from 'dotenv';
import app from './src/app.js';
import { sequelize } from './src/models/index.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // Verify DB Connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    const server = app.listen(PORT, () => {
      console.log(`Todo Tracker API Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`\n---------------------------------------------------------`);
        console.log(`⚠️  PORT ${PORT} IS ALREADY IN USE!`);
        console.log(`The Todo Tracker API is ALREADY running in another terminal window.`);
        console.log(`Your API is active at: http://localhost:${PORT}`);
        console.log(`---------------------------------------------------------\n`);
      } else {
        console.error('Server error:', error);
      }
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
}

startServer();
