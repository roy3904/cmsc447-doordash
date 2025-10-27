
import express from 'express';
import { getAllRestaurants, getMenuItems, placeOrder } from '../controllers/apiController.js';

const router = express.Router();

// API Route to get all restaurants from the db
router.get('/restaurants', getAllRestaurants);

// API Route to get menu items for a specific restaurant
router.get('/restaurants/:id/menu', getMenuItems);

// API Route to place an order
router.post('/orders', placeOrder);

export default router;
