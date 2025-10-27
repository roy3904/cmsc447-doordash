
import express from 'express';
import { getAllRestaurants, getMenuItems, placeOrder, getCart, addToCart, removeFromCart, clearCart, getMenuItem } from '../controllers/apiController.js';

const router = express.Router();

// API Route to get all restaurants from the db
router.get('/restaurants', getAllRestaurants);

// API Route to get menu items for a specific restaurant
router.get('/restaurants/:id/menu', getMenuItems);

// API Route to get a single menu item
router.get('/menuitems/:id', getMenuItem);

// API Route to place an order
router.post('/orders', placeOrder);

// API Route to get the user\'s cart
router.get('/cart', getCart);

// API Route to add an item to the cart
router.post('/cart/item', addToCart);

// API Route to remove an item from the cart
router.delete('/cart/item', removeFromCart);

// API Route to clear the cart
router.delete('/cart', clearCart);

export default router;
