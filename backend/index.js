const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('./models');
const { Umzug, SequelizeStorage } = require('umzug');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const statusRoutes = require('./routes/status');

// Enable CORS for specific origins
app.use(cors({
    origin: ['http://localhost:5173', 'https://www.ticketexpert.me', 'https://www.organiser.ticketexpert.me'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/status', statusRoutes);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize Umzug for migrations only
    const umzug = new Umzug({
      migrations: { glob: 'migrations/*.js' },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });

    // Run migrations
    await umzug.up();
    console.log('Migrations completed successfully');

    // If not in test environment, check if we need to run seeders
    if (process.env.NODE_ENV !== 'test') {
      const { execSync } = require('child_process');
      try {
        // Check if we have any events in the database
        const eventCount = await sequelize.models.Event.count();
        if (eventCount === 0) {
          console.log('No events found, running seeders...');
          execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
          console.log('Seeders completed successfully');
        } else {
          console.log(`Found ${eventCount} events in database, skipping seeders`);
        }
      } catch (error) {
        console.error('Error running seeders:', error);
      }
    }

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
