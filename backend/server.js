import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/database.js';
import { PORT, NODE_ENV } from './src/config/constants.js';
import { runScraper } from './src/services/scraperService.js';

// Connect to MongoDB
await connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
});

// Run scraper on startup (non-blocking)
runScraper()
  .then((result) => {
    console.log('📰 Initial scrape completed:', result);
  })
  .catch((error) => {
    console.error('⚠️  Initial scrape failed (non-blocking):', error.message);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
