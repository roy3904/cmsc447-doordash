import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Webpages
const HOMEPAGE = "homepage.html"
const COFFEE_SHOPPE = "coffeeshop.html"

// Database Pages
const DB_RESTAURANTS = "db-pages/restaurants.html"
const DB_COFFEE_SHOPPE = "db-pages/coffeeshoppe.html"

export const getHomepage = (req, res) => {
  // #swagger.tags = ['Page']
  // #swagger.summary = 'Redirect to Homepage'
  res.sendFile(path.join(__dirname, '../../public', HOMEPAGE));
};

export const getRestaurantPage = (req, res) => {
  // #swagger.tags = ['Page']
  // #swagger.summary = 'Redirect to a restaurant page'
  res.sendFile(path.join(__dirname, '../../public', "restaurant.html"));
};

export const getDbRestaurants = (req, res) => {
  // #swagger.tags = ['DB_Page']
  // #swagger.summary = 'Redirect to Restaurants DB Page'
  res.sendFile(path.join(__dirname, '../../public', DB_RESTAURANTS));
};

export const getDbCoffeeShoppe = (req, res) => {
  // #swagger.tags = ['DB_Page']
  // #swagger.summary = 'Redirect to COFFEE_SHOPPE DB Page'
  res.sendFile(path.join(__dirname, '../../public', DB_COFFEE_SHOPPE));
};

export const getAdminPage = (req, res) => {
  // #swagger.tags = ['Page']
  // #swagger.summary = 'Redirect to Admin Page'
  res.sendFile(path.join(__dirname, '../../public', 'admin.html'));
};
