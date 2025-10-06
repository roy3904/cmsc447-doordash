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

export const getCoffeeShoppe = (req, res) => {
  // #swagger.tags = ['Page']
  // #swagger.summary = 'Redirect to The Coffee Shoppe page'
  res.sendFile(path.join(__dirname, '../../public', COFFEE_SHOPPE));
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
