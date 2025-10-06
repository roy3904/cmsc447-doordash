import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRestaurants } from './database.js';

// Create path to the project directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express App
const app = express();
const port = 3000;

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')));



// API Route to get all restaurants from the db
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await getRestaurants();
    res.json({ restaurants });
  } catch (error) {
    console.error('Failed to get restaurants:', error);
    res.status(500).json({ error: 'Failed to get restaurants' });
  }
});

// Route to serve homepage
const HOMEPAGE = "homepage.html"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', HOMEPAGE));
});

// Route to serve Coffe Shop page
const COFFEE_SHOP = "coffeeshop.html"
app.get('/coffee-shop', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', COFFEE_SHOP));
});

// Route to serve Restaurants page (restaurants.html)
const RESTAURANT_PAGE = "restaurants.html"
app.get('/restaurants', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', RESTAURANT_PAGE));
});




// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${port}`);
});