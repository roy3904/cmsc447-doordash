
import express from 'express';
import { getAllRestaurants, getMenuItems } from '../controllers/apiController.js';

const router = express.Router();

// API Route to get all restaurants from the db
router.get('/restaurants', getAllRestaurants);

// API Route to get menu items for a specific restaurant
router.get('/restaurants/:id/menu', getMenuItems);

export default router;
