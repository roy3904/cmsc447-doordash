
import express from 'express';
import { getHomepage, getRestaurantPage, getDbRestaurants, getDbCoffeeShoppe, getAdminPage } from '../controllers/pagesController.js';

const router = express.Router();

// Route to serve homepage
router.get('/', getHomepage);
// Route to serve a restaurant page by ID
router.get('/restaurant/:id', getRestaurantPage);


// Route to serve Restaurants DB Page
router.get('/db/restaurants', getDbRestaurants);
// Route to serve DB Coffee Shop page
router.get('/db/coffeeshoppe', getDbCoffeeShoppe);

// Route to serve Admin page
router.get('/admin', getAdminPage);

export default router;
