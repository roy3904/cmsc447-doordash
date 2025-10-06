import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRestaurants, getMenuItemsByRestaurantId } from './database.js';

// Create path to the project directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express App
const app = express();
const port = 3000;

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')));



// API Route to get all restaurants from the db
// API Route to get menu items for a specific restaurant
app.get('/api/restaurants/:id/menu', async (req, res) => {
  try {
    const menuItems = await getMenuItemsByRestaurantId(req.params.id);
    res.json({ menuItems });
  } catch (error) {
    console.error(`Failed to get menu items for restaurant ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get menu items' });
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

// Route to serve DB Coffee Shop page
const DB_COFFEE_SHOP = "db-pages/db-coffeeshop.html"
app.get('/db-coffeeshop', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', DB_COFFEE_SHOP));
});




// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${port}`);
});