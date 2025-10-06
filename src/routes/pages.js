
import express from 'express';
import { getHomepage, getCoffeeShoppe, getDbRestaurants, getDbCoffeeShoppe } from '../controllers/pagesController.js';

const router = express.Router();

// Route to serve homepage
router.get('/', getHomepage);
// Route to serve The Coffe Shoppe page
router.get('/coffee-shoppe', getCoffeeShoppe);


// Route to serve Restaurants DB Page
router.get('/db/restaurants', getDbRestaurants);
// Route to serve DB Coffee Shop page
router.get('/db/coffeeshoppe', getDbCoffeeShoppe);

export default router;
