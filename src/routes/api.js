
import express from 'express';
import { getAllRestaurants, getRestaurant, addRestaurant, modifyRestaurant, removeRestaurant, getMenuItems, placeOrder, getCart, addToCart, removeFromCart, clearCart, getMenuItem, getOrdersPlaced, acceptOrder, declineOrder, completeOrder, getAllWorkers, getWorker, modifyWorker, addWorker, getWorkerJobs, removeWorker, createWorkerApplication, getAllWorkerApplications, getWorkerApplication, approveWorkerApplication, declineWorkerApplication, modifyWorkerApplication, removeWorkerApplication, getAllCustomers, getCustomer, addCustomer, modifyCustomer, removeCustomer } from '../controllers/apiController.js';

const router = express.Router();

// API Route to get all restaurants from the db
router.get('/restaurants', getAllRestaurants);

// API Route to create a new restaurant
router.post('/restaurants', addRestaurant);

// API Route to get menu items for a specific restaurant (must be before /restaurants/:id)
router.get('/restaurants/:id/menu', getMenuItems);

// API Route to get a single restaurant
router.get('/restaurants/:id', getRestaurant);

// API Route to update a restaurant
router.put('/restaurants/:id', modifyRestaurant);

// API Route to delete a restaurant
router.delete('/restaurants/:id', removeRestaurant);

// API Route to get a single menu item
router.get('/menuitems/:id', getMenuItem);

// API Route to place an order
router.post('/orders', placeOrder);

// Get orders that are placed and waiting for acceptance
router.get('/orders/placed', getOrdersPlaced);

// Accept an order (assign to worker)
router.post('/orders/:id/accept', acceptOrder);

// Worker declines an order (record decline)
router.post('/orders/:id/decline', declineOrder);

// Complete a delivery job
router.post('/jobs/:id/complete', completeOrder);

// Get active jobs for a worker
router.get('/jobs/worker/:id', getWorkerJobs);

// API Route to get the user\'s cart
router.get('/cart', getCart);

// API Route to add an item to the cart
router.post('/cart/item', addToCart);

// API Route to remove an item from the cart
router.delete('/cart/item', removeFromCart);

// API Route to clear the cart
router.delete('/cart', clearCart);

// Workers
router.get('/workers', getAllWorkers);
router.get('/workers/:id', getWorker);
router.post('/workers', addWorker);
router.put('/workers/:id', modifyWorker);
// Delete a worker
router.delete('/workers/:id', removeWorker);

// Worker Applications
router.post('/worker-applications', createWorkerApplication);
router.get('/worker-applications', getAllWorkerApplications);
router.get('/worker-applications/:id', getWorkerApplication);
router.put('/worker-applications/:id', modifyWorkerApplication);
router.post('/worker-applications/:id/approve', approveWorkerApplication);
router.post('/worker-applications/:id/decline', declineWorkerApplication);
router.delete('/worker-applications/:id', removeWorkerApplication);

// Customers
router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomer);
router.post('/customers', addCustomer);
router.put('/customers/:id', modifyCustomer);
router.delete('/customers/:id', removeCustomer);

export default router;
