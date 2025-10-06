import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRestaurants, getMenuItemsByRestaurantId } from './database.js';

// Swagger Docs
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger-output.json' with { type: 'json' };

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
  // #swagger.tags = ['Restaurants']
  // #swagger.summary = 'Get all restaurants'
  try {
    const restaurants = await getRestaurants();
    res.json({ restaurants });
  } catch (error) {
    console.error('Failed to get restaurants:', error);
    res.status(500).json({ error: 'Failed to get restaurants' });
  }
});

// API Route to get menu items for a specific restaurant
app.get('/api/restaurants/:id/menu', async (req, res) => {
  // #swagger.tags = ['Restaurants']
  // #swagger.summary = 'Get menu for a specific restaurant'
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
  // #swagger.tags = ['Page']
  // #swagger.summary = 'Redirect to Homepage'
  res.sendFile(path.join(__dirname, '../public', HOMEPAGE));
});
// Route to serve The Coffe Shoppe page
const COFFEE_SHOPPE = "coffeeshop.html"
app.get('/coffee-shoppe', (req, res) => {
  // #swagger.tags = ['Page']
  // #swagger.summary = 'Redirect to The Coffee Shoppe page'
  res.sendFile(path.join(__dirname, '../public', COFFEE_SHOPPE));
});

// Route to serve Restaurants DB Page
const DB_RESTAURANTS = "db-pages/restaurants.html"
app.get('/db/restaurants', (req, res) => {
  // #swagger.tags = ['DB_Page']
  // #swagger.summary = 'Redirect to Restaurants DB Page'
  res.sendFile(path.join(__dirname, '../public', DB_RESTAURANTS));
});

// Route to serve DB Coffee Shop page
const DB_COFFEE_SHOPPE = "db-pages/coffeeshoppe.html"
  // #swagger.tags = ['DB_Page']
  // #swagger.summary = 'Redirect to COFFEE_SHOPPE DB Page'
app.get('/db/coffeeshoppe', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', DB_COFFEE_SHOPPE));
});



// Serve Swagger UI Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${port}`);
});