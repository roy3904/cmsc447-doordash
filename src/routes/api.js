
import express from 'express';
import { getAllRestaurants, getRestaurant, addRestaurant, modifyRestaurant, removeRestaurant, getMenuItems, getRestaurantOrders, placeOrder, getCart, addToCart, removeFromCart, clearCart, getMenuItem, modifyMenuItem, getAvailableOrders, acceptOrder, declineOrder, completeOrder, updateOrderStatus, getAllWorkers, getWorker, modifyWorker, addWorker, getWorkerJobs, removeWorker, createWorkerApplication, getAllWorkerApplications, getWorkerApplication, approveWorkerApplication, declineWorkerApplication, modifyWorkerApplication, removeWorkerApplication, getAllCustomers, getCustomer, addCustomer, modifyCustomer, removeCustomer, loginAdminUser, loginCustomer, postFeedback, getFeedback, getCustomerOrders, getWorkerFeedback, acknowledgeFeedback, loginRestaurantStaff, mergeCart, getWorkerEarnings, modifyRestaurantStaff, getAllRestaurantStaff, removeStaff } from '../controllers/apiController.js';

const router = express.Router();

// Admin Login
router.post('/login', loginAdminUser);

// Restaurant Staff Login
router.post('/restaurant-staff/login', loginRestaurantStaff);

// API Route to get restaurant staff from db'
router.get('/restaurant-staff', getAllRestaurantStaff);

//API Route to modify restaurant staff
router.put('/restaurant-staff/:id', modifyRestaurantStaff)

//api Route to delete restaurant staff
router.delete('/restaurant-staff/:id', removeStaff);

// API Route to get all restaurants from the db
router.get('/restaurants', getAllRestaurants);

// API Route to create a new restaurant
router.post('/restaurants', addRestaurant);

// API Route to get menu items for a specific restaurant (must be before /restaurants/:id)
router.get('/restaurants/:id/menu', getMenuItems);

// API Route to get orders for a specific restaurant (must be before /restaurants/:id)
router.get('/restaurants/:id/orders', getRestaurantOrders);

// API Route to get a single restaurant
router.get('/restaurants/:id', getRestaurant);

// API Route to update a restaurant
router.put('/restaurants/:id', modifyRestaurant);

// API Route to delete a restaurant
router.delete('/restaurants/:id', removeRestaurant);

// API Route to get a single menu item
router.get('/menuitems/:id', getMenuItem);

// API Route to update a menu item
router.put('/menuitems/:id', modifyMenuItem);

// API Route to place an order
router.post('/orders', placeOrder);

// Get orders that are ready for pickup
router.get('/orders/available', getAvailableOrders);

// Accept an order (assign to worker)
router.post('/orders/:id/accept', acceptOrder);

// Worker declines an order (record decline)
router.post('/orders/:id/decline', declineOrder);

// Update order status
router.put('/orders/:id/status', updateOrderStatus);

// Complete a delivery job
router.post('/jobs/:id/complete', completeOrder);

// Get active jobs for a worker
router.get('/jobs/worker/:id', getWorkerJobs);

// API Route to get the user\'s cart
router.get('/cart', getCart);

// API Route to merge guest cart into a customer's cart
router.post('/cart/merge', mergeCart);

// API Route to add an item to the cart
router.post('/cart/item', addToCart);

// API Route to remove an item from the cart
router.delete('/cart/item', removeFromCart);

// API Route to clear the cart
router.delete('/cart', clearCart);

// Get past orders for a customer (query param: customerId)
router.get('/orders/customer', getCustomerOrders);

// Customer login
router.post('/customers/login', loginCustomer);

// Feedback
router.post('/feedback', postFeedback);
router.get('/feedback/:id', getFeedback);

// Workers
router.get('/workers', getAllWorkers);
router.get('/workers/:id', getWorker);
// Get feedback for a worker (feedback left on orders delivered by this worker)
router.get('/workers/:id/feedback', getWorkerFeedback);
// Get earnings summary for a worker (completed jobs & tip total)
router.get('/workers/:id/earnings', getWorkerEarnings);
// Acknowledge a feedback entry
router.post('/feedback/:id', acknowledgeFeedback);
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
