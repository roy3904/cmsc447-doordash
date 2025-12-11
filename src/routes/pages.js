
import express from 'express';
import * as pagesController from '../controllers/pagesController.js';

const router = express.Router();

// Route to serve homepage
router.get('/', pagesController.getHomepage);
// Route to serve a restaurant page by ID
router.get('/restaurant/:id', pagesController.getRestaurantPage);


// Route to serve Restaurants DB Page
router.get('/db/restaurants', pagesController.getDbRestaurants);
// Route to serve DB Coffee Shop page
router.get('/db/coffeeshoppe', pagesController.getDbCoffeeShoppe);

// Route to serve Admin page
router.get('/admin', pagesController.getAdminPage);

export default router;
