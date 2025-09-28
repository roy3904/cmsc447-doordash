import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRestaurants } from './database.js';

// Create a reliable path to the project directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express App
const app = express();
const port = 3000;

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')));

// API Route to get all restaurants from the db
app.get('/api/restaurants', async (req, res) => {
  const restaurants = await getRestaurants();
  res.json({ restaurants });
});
// Route to serve homepage (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
// Route to serve Restaurants page (restaurants.html)
app.get('/restaurants', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'restaurants.html'));
});


// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${port}`);
});