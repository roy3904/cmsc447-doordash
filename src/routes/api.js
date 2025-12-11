
import express from 'express';
import * as apiController from '../controllers/apiController.js';

const router = express.Router();

// Admin Login
router.post('/login', apiController.loginAdminUser);

// Restaurant Staff Login
router.post('/restaurant-staff/login', apiController.loginRestaurantStaff);

// API Route to get restaurant staff from db'
router.get('/restaurant-staff', apiController.getAllRestaurantStaff);

//API Route to modify restaurant staff
router.put('/restaurant-staff/:id', apiController.modifyRestaurantStaff)

//api Route to delete restaurant staff
router.delete('/restaurant-staff/:id', apiController.removeStaff);

// API Route to get all restaurants from the db
router.get('/restaurants', apiController.getAllRestaurants);

// API Route to create a new restaurant
router.post('/restaurants', apiController.addRestaurant);

// API Route to get menu items for a specific restaurant (must be before /restaurants/:id)
router.get('/restaurants/:id/menu', apiController.getMenuItems);

// API Route to get orders for a specific restaurant (must be before /restaurants/:id)
router.get('/restaurants/:id/orders', apiController.getRestaurantOrders);

// API Route to get a single restaurant
router.get('/restaurants/:id', apiController.getRestaurant);

// API Route to update a restaurant
router.put('/restaurants/:id', apiController.modifyRestaurant);

// API Route to delete a restaurant
router.delete('/restaurants/:id', apiController.removeRestaurant);

// API Route to get a single menu item
router.get('/menuitems/:id', apiController.getMenuItem);

// API Route to update a menu item
router.put('/menuitems/:id', apiController.modifyMenuItem);

// API Route to place an order
router.post('/orders', apiController.placeOrder);

// Get orders that are ready for pickup
router.get('/orders/available', apiController.getAvailableOrders);

// Accept an order (assign to worker)
router.post('/orders/:id/accept', apiController.acceptOrder);

// Worker declines an order (record decline)
router.post('/orders/:id/decline', apiController.declineOrder);

// Update order status
router.put('/orders/:id/status', apiController.updateOrderStatus);

// Complete a delivery job
router.post('/jobs/:id/complete', apiController.completeOrder);

// Get active jobs for a worker
router.get('/jobs/worker/:id', apiController.getWorkerJobs);

// API Route to get the user\'s cart
router.get('/cart', apiController.getCart);

// API Route to merge guest cart into a customer's cart
router.post('/cart/merge', apiController.mergeCart);

// API Route to add an item to the cart
router.post('/cart/item', apiController.addToCart);

// API Route to remove an item from the cart
router.delete('/cart/item', apiController.removeFromCart);

// API Route to clear the cart
router.delete('/cart', apiController.clearCart);

// Get past orders for a customer (query param: customerId)
router.get('/orders/customer', apiController.getCustomerOrders);

// Customer login
router.post('/customers/login', apiController.loginCustomer);

// Feedback
router.post('/feedback', apiController.postFeedback);
router.get('/feedback/:id', apiController.getFeedback);

// Workers
router.get('/workers', apiController.getAllWorkers);
router.get('/workers/:id', apiController.getWorker);
// Get feedback for a worker (feedback left on orders delivered by this worker)
router.get('/workers/:id/feedback', apiController.getWorkerFeedback);
// Get earnings summary for a worker (completed jobs & tip total)
router.get('/workers/:id/earnings', apiController.getWorkerEarnings);
// Acknowledge a feedback entry
router.post('/feedback/:id', apiController.acknowledgeFeedback);
router.post('/workers', apiController.addWorker);
router.put('/workers/:id', apiController.modifyWorker);
// Delete a worker
router.delete('/workers/:id', apiController.removeWorker);

// Worker Applications
router.post('/worker-applications', apiController.createWorkerApplication);
router.get('/worker-applications', apiController.getAllWorkerApplications);
router.get('/worker-applications/:id', apiController.getWorkerApplication);
router.put('/worker-applications/:id', apiController.modifyWorkerApplication);
router.post('/worker-applications/:id/approve', apiController.approveWorkerApplication);
router.post('/worker-applications/:id/decline', apiController.declineWorkerApplication);
router.delete('/worker-applications/:id', apiController.removeWorkerApplication);

// Customers
router.get('/customers', apiController.getAllCustomers);
router.get('/customers/:id', apiController.getCustomer);
router.post('/customers', apiController.addCustomer);
router.put('/customers/:id', apiController.modifyCustomer);
router.delete('/customers/:id', apiController.removeCustomer);

// Notifications
router.get('/notifications/:userType/:userId', apiController.getUserNotifications);
router.put('/notifications/:id/read', apiController.markNotificationRead);
router.put('/notifications/:userType/:userId/read-all', apiController.markAllNotificationsRead);

export default router;
