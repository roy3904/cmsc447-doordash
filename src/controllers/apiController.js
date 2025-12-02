<<<<<<< HEAD
import { getRestaurants, getRestaurantById as dbGetRestaurantById, createRestaurant as dbCreateRestaurant, updateRestaurant as dbUpdateRestaurant, deleteRestaurant as dbDeleteRestaurant, getMenuItemsByRestaurantId, createOrder, getCart as dbGetCart, addToCart as dbAddToCart, removeFromCart as dbRemoveFromCart, clearCart as dbClearCart, getMenuItem as dbGetMenuItem, updateMenuItem as dbUpdateMenuItem, getPlacedOrders, getOrdersByRestaurantId as dbGetOrdersByRestaurantId, assignOrderToWorker, completeDeliveryJob, updateOrderStatus as dbUpdateOrderStatus, getWorkers, getWorkerById as dbGetWorkerById, updateWorker as dbUpdateWorker, createWorker, declineOrderByWorker, deleteWorker, createWorkerApplication as dbCreateWorkerApplication, getWorkerApplications as dbGetWorkerApplications, getWorkerApplicationById as dbGetWorkerApplicationById, updateWorkerApplicationStatus as dbUpdateWorkerApplicationStatus, updateWorkerApplication as dbUpdateWorkerApplication, deleteWorkerApplication as dbDeleteWorkerApplication, getCustomers as dbGetCustomers, getCustomerById as dbGetCustomerById, createCustomer as dbCreateCustomer, updateCustomer as dbUpdateCustomer, deleteCustomer as dbDeleteCustomer, getSystemAdmin, getRestaurantStaffByEmail } from '../database.js';
=======
>>>>>>> df03d8e4e3b9479b06d522835e8939260f463aed
import { getRestaurants, getRestaurantById as dbGetRestaurantById, createRestaurant as dbCreateRestaurant, updateRestaurant as dbUpdateRestaurant, deleteRestaurant as dbDeleteRestaurant, getMenuItemsByRestaurantId, createOrder, getCart as dbGetCart, addToCart as dbAddToCart, removeFromCart as dbRemoveFromCart, clearCart as dbClearCart, getMenuItem as dbGetMenuItem, updateMenuItem as dbUpdateMenuItem, getPlacedOrders, getOrdersByRestaurantId as dbGetOrdersByRestaurantId, getOrdersByCustomerId as dbGetOrdersByCustomerId, getFeedbackForWorker as dbGetFeedbackForWorker, deleteFeedback as dbDeleteFeedback, assignOrderToWorker, completeDeliveryJob, updateOrderStatus as dbUpdateOrderStatus, getWorkers, getWorkerById as dbGetWorkerById, updateWorker as dbUpdateWorker, createWorker, declineOrderByWorker, deleteWorker, createWorkerApplication as dbCreateWorkerApplication, getWorkerApplications as dbGetWorkerApplications, getWorkerApplicationById as dbGetWorkerApplicationById, updateWorkerApplicationStatus as dbUpdateWorkerApplicationStatus, updateWorkerApplication as dbUpdateWorkerApplication, deleteWorkerApplication as dbDeleteWorkerApplication, getCustomers as dbGetCustomers, getCustomerById as dbGetCustomerById, createCustomer as dbCreateCustomer, updateCustomer as dbUpdateCustomer, deleteCustomer as dbDeleteCustomer, getCustomerByEmail as dbGetCustomerByEmail, addFeedback as dbAddFeedback, getFeedbackByOrder as dbGetFeedbackByOrder, getSystemAdmin } from '../database.js';
import { getJobsForWorker } from '../database.js';
import argon2 from 'argon2';

export const getAllRestaurants = async (req, res) => {
  // #swagger.tags = ['Restaurants']
  // #swagger.summary = 'Get all restaurants'
  try {
    const restaurants = await getRestaurants();
    res.json({ restaurants });
  } catch (error) {
    console.error('Failed to get restaurants:', error);
    res.status(500).json({ error: 'Failed to get restaurants' });
  }
};

export const getRestaurant = async (req, res) => {
  // #swagger.tags = ['Restaurants']
  // #swagger.summary = 'Get a single restaurant'
  try {
    const restaurantId = req.params.id;
    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID required' });
    }
    const restaurant = await dbGetRestaurantById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ restaurant });
  } catch (error) {
    console.error('Failed to get restaurant:', error);
    res.status(500).json({ error: 'Failed to get restaurant' });
  }
};

export const addRestaurant = async (req, res) => {
  // #swagger.tags = ['Restaurants']
  // #swagger.summary = 'Create a new restaurant'
  try {
    const restaurant = req.body;
    if (!restaurant || !restaurant.RestaurantID) {
      return res.status(400).json({ error: 'Restaurant data missing or RestaurantID required' });
    }
    await dbCreateRestaurant(restaurant);
    res.status(201).json({ message: 'Restaurant created' });
  } catch (error) {
    console.error('Failed to create restaurant:', error);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

export const modifyRestaurant = async (req, res) => {
  // #swagger.tags = ['Restaurants']
  // #swagger.summary = 'Update a restaurant'
  try {
    const restaurantId = req.params.id;
    const updates = req.body;
    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID required' });
    }
    await dbUpdateRestaurant(restaurantId, updates);
    res.json({ message: 'Restaurant updated' });
  } catch (error) {
    console.error('Failed to update restaurant:', error);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
};

export const removeRestaurant = async (req, res) => {
  // #swagger.tags = ['Restaurants']
  // #swagger.summary = 'Delete a restaurant'
  try {
    const restaurantId = req.params.id;
    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID required' });
    }
    await dbDeleteRestaurant(restaurantId);
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    console.error('Failed to delete restaurant:', error);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};

export const getMenuItems = async (req, res) => {
  // #swagger.tags = ['Restaurants']
  // #swagger.summary = 'Get menu for a specific restaurant'
  try {
    const menuItems = await getMenuItemsByRestaurantId(req.params.id);
    res.json({ menuItems });
  } catch (error) {
    console.error(`Failed to get menu items for restaurant ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get menu items' });
  }
};

export const getRestaurantOrders = async (req, res) => {
  // #swagger.tags = ['Restaurants']
  // #swagger.summary = 'Get orders for a specific restaurant'
  try {
    const restaurantId = req.params.id;
    const status = req.query.status; // Optional status filter

    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID required' });
    }

    const orders = await dbGetOrdersByRestaurantId(restaurantId, status);
    res.json({ orders, count: orders.length });
  } catch (error) {
    console.error(`Failed to get orders for restaurant ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get restaurant orders' });
  }
};

export const placeOrder = async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.summary = 'Place a new order'
  try {
    const orderId = await createOrder(req.body);
    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    console.error('Failed to place order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

// Customer login (simple email/password check)
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const customer = await dbGetCustomerByEmail(email);
    if (!customer) return res.status(401).json({ error: 'Invalid credentials' });
    // NOTE: PasswordHash may be plain or hashed in DB. This project currently stores raw/password-hash inconsistently.
    // For now compare directly; in a real app use proper hashing + verification (argon2.verify).
    if (customer.PasswordHash !== password) return res.status(401).json({ error: 'Invalid credentials' });
    // return minimal customer info
    res.json({ customer: { CustomerID: customer.CustomerID, Name: customer.Name, Email: customer.Email } });
  } catch (error) {
    console.error('Customer login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Feedback endpoints
export const postFeedback = async (req, res) => {
  try {
    const { orderId, customerId, rating, comment } = req.body;
    if (!orderId || !customerId || !rating) return res.status(400).json({ error: 'orderId, customerId and rating required' });
    const feedback = {
      FeedbackID: 'FB-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8).toUpperCase(),
      OrderID: orderId,
      CustomerID: customerId,
      Rating: parseInt(rating, 10),
      Comment: comment || ''
    };
    await dbAddFeedback(feedback);
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) return res.status(400).json({ error: 'Order ID required' });
    const feedback = await dbGetFeedbackByOrder(orderId);
    res.json({ feedback });
  } catch (error) {
    console.error('Failed to get feedback:', error);
    res.status(500).json({ error: 'Failed to get feedback' });
  }
};

export const getOrdersPlaced = async (req, res) => {
  try {
    const orders = await getPlacedOrders();
    res.json({ orders });
  } catch (error) {
    console.error('Failed to get placed orders:', error);
    res.status(500).json({ error: 'Failed to get placed orders' });
  }
};

export const getWorkerFeedback = async (req, res) => {
  try {
    const workerId = req.params.id;
    if (!workerId) return res.status(400).json({ error: 'workerId required' });
    const feedbacks = await dbGetFeedbackForWorker(workerId);
    res.json({ feedbacks });
  } catch (error) {
    console.error('Failed to get worker feedback:', error);
    res.status(500).json({ error: 'Failed to get worker feedback' });
  }
};

export const acknowledgeFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    if (!feedbackId) return res.status(400).json({ error: 'Feedback ID required' });
    await dbDeleteFeedback(feedbackId);
    res.json({ message: 'Feedback acknowledged and removed' });
  } catch (error) {
    console.error('Failed to acknowledge feedback:', error);
    res.status(500).json({ error: 'Failed to acknowledge feedback' });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.query.customerId || req.params.id;
    if (!customerId) return res.status(400).json({ error: 'customerId required' });
    const orders = await dbGetOrdersByCustomerId(customerId);
    res.json({ orders, count: orders.length });
  } catch (error) {
    console.error('Failed to get customer orders:', error);
    res.status(500).json({ error: 'Failed to get customer orders' });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { workerId } = req.body;
    if(!workerId) return res.status(400).json({ error: 'workerId required' });
    const jobId = await assignOrderToWorker(orderId, workerId);
    res.json({ message: 'Order accepted', jobId });
  } catch (error) {
    console.error('Failed to accept order:', error);
    res.status(500).json({ error: 'Failed to accept order' });
  }
};

export const declineOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { workerId } = req.body;
    if(!workerId) return res.status(400).json({ error: 'workerId required' });
    const jobId = await declineOrderByWorker(orderId, workerId);
    res.json({ message: 'Order declined recorded', jobId });
  } catch (error) {
    console.error('Failed to record decline:', error);
    res.status(500).json({ error: 'Failed to record decline' });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const jobId = req.params.id;
    await completeDeliveryJob(jobId);
    res.json({ message: 'Job completed' });
  } catch (error) {
    console.error('Failed to complete job:', error);
    res.status(500).json({ error: 'Failed to complete job' });
  }
};

export const updateOrderStatus = async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.summary = 'Update order status'
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID required' });
    }
    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    await dbUpdateOrderStatus(orderId, status);
    res.json({ message: 'Order status updated', status });
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ error: error.message || 'Failed to update order status' });
  }
};

export const getAllWorkers = async (req, res) => {
  try {
    const workers = await getWorkers();
    res.json({ workers });
  } catch (error) {
    console.error('Failed to get workers:', error);
    res.status(500).json({ error: 'Failed to get workers' });
  }
};

export const getWorker = async (req, res) => {
  try {
    const workerId = req.params.id;
    if (!workerId) {
      return res.status(400).json({ error: 'Worker ID required' });
    }
    const worker = await dbGetWorkerById(workerId);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json({ worker });
  } catch (error) {
    console.error('Failed to get worker:', error);
    res.status(500).json({ error: 'Failed to get worker' });
  }
};

export const modifyWorker = async (req, res) => {
  try {
    const workerId = req.params.id;
    const updates = req.body;
    if (!workerId) {
      return res.status(400).json({ error: 'Worker ID required' });
    }
    await dbUpdateWorker(workerId, updates);
    res.json({ message: 'Worker updated' });
  } catch (error) {
    console.error('Failed to update worker:', error);
    res.status(500).json({ error: 'Failed to update worker' });
  }
};

export const addWorker = async (req, res) => {
  try {
    const worker = req.body;
    if(!worker || !worker.WorkerID) return res.status(400).json({ error: 'Worker data missing or WorkerID required' });
    await createWorker(worker);
    res.status(201).json({ message: 'Worker created' });
  } catch (error) {
    console.error('Failed to create worker:', error);
    res.status(500).json({ error: 'Failed to create worker' });
  }
};

export const removeWorker = async (req, res) => {
  try {
    const workerId = req.params.id;
    if(!workerId) return res.status(400).json({ error: 'workerId required' });
    await deleteWorker(workerId);
    res.json({ message: 'Worker deleted' });
  } catch (error) {
    console.error('Failed to delete worker:', error);
    res.status(500).json({ error: 'Failed to delete worker' });
  }
};

export const getWorkerJobs = async (req, res) => {
  try {
    const workerId = req.params.id;
    if (!workerId) return res.status(400).json({ error: 'workerId required' });
    const jobs = await getJobsForWorker(workerId);
    res.json({ jobs });
  } catch (error) {
    console.error('Failed to get worker jobs:', error);
    res.status(500).json({ error: 'Failed to get worker jobs' });
  }
};

// =======================================
// Worker Application Controllers
// =======================================

export const createWorkerApplication = async (req, res) => {
  try {
    const application = req.body;
    if (!application || !application.WorkerID) {
      return res.status(400).json({ error: 'Application data missing or WorkerID required' });
    }
    const applicationId = await dbCreateWorkerApplication(application);
    res.status(201).json({ message: 'Application submitted', applicationId });
  } catch (error) {
    console.error('Failed to create worker application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

export const getAllWorkerApplications = async (req, res) => {
  try {
    const options = {
      status: req.query.status,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : 0
    };

    const result = await dbGetWorkerApplications(options);
    res.json(result);
  } catch (error) {
    console.error('Failed to get worker applications:', error);
    res.status(500).json({ error: 'Failed to get worker applications' });
  }
};

export const getWorkerApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID required' });
    }
    const application = await dbGetWorkerApplicationById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ application });
  } catch (error) {
    console.error('Failed to get worker application:', error);
    res.status(500).json({ error: 'Failed to get worker application' });
  }
};

export const approveWorkerApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID required' });
    }

    // Get the application
    const application = await dbGetWorkerApplicationById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Create the worker
    await createWorker({
      WorkerID: application.WorkerID,
      Name: application.Name,
      Email: application.Email,
      Phone: application.Phone,
      AvailabilityStatus: application.Availability || 'Available',
      PasswordHash: application.PasswordHash
    });

    // Update application status
    await dbUpdateWorkerApplicationStatus(applicationId, 'Approved');

    res.json({ message: 'Application approved and worker created' });
  } catch (error) {
    console.error('Failed to approve worker application:', error);
    res.status(500).json({ error: 'Failed to approve application' });
  }
};

export const declineWorkerApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID required' });
    }

    // Update application status
    await dbUpdateWorkerApplicationStatus(applicationId, 'Declined');

    res.json({ message: 'Application declined' });
  } catch (error) {
    console.error('Failed to decline worker application:', error);
    res.status(500).json({ error: 'Failed to decline application' });
  }
};

export const modifyWorkerApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const updates = req.body;
    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID required' });
    }
    await dbUpdateWorkerApplication(applicationId, updates);
    res.json({ message: 'Application updated' });
  } catch (error) {
    console.error('Failed to update worker application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
};

export const removeWorkerApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID required' });
    }
    await dbDeleteWorkerApplication(applicationId);
    res.json({ message: 'Application deleted' });
  } catch (error) {
    console.error('Failed to delete worker application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
};

export const getCart = async (req, res) => {
  // #swagger.tags = ['Cart']
  // #swagger.summary = 'Get the current user\'s cart'
  try {
    // allow client to pass customerId as query param (e.g., /api/cart?customerId=...)
    const customerId = req.query.customerId || 'CUST-123'; // Hardcoded fallback
    const cart = await dbGetCart(customerId);
    res.json({ cart });
  } catch (error) {
    console.error('Failed to get cart:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

export const addToCart = async (req, res) => {
  // #swagger.tags = ['Cart']
  // #swagger.summary = 'Add an item to the cart'
  try {
    const customerId = req.body.customerId || 'CUST-123'; // use provided customer id when available
    const { itemId, quantity = 1 } = req.body;
    await dbAddToCart(customerId, itemId, quantity);
    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

export const removeFromCart = async (req, res) => {
  // #swagger.tags = ['Cart']
  // #swagger.summary = 'Remove an item from the cart'
  try {
    const customerId = req.body.customerId || 'CUST-123'; // use provided customer id when available
    const { itemId, quantity = 1 } = req.body;
    await dbRemoveFromCart(customerId, itemId, quantity);
    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

export const clearCart = async (req, res) => {
  // #swagger.tags = ['Cart']
  // #swagger.summary = 'Clear the user\'s cart'
  try {
    const customerId = 'CUST-123'; // Hardcoded for now
    await dbClearCart(customerId);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Failed to clear cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

export const getMenuItem = async (req, res) => {
  // #swagger.tags = ['Menu Items']
  // #swagger.summary = 'Get a single menu item'
  try {
    const menuItem = await dbGetMenuItem(req.params.id);
    res.json({ menuItem });
  } catch (error) {
    console.error('Failed to get menu item:', error);
    res.status(500).json({ error: 'Failed to get menu item' });
  }
};

export const modifyMenuItem = async (req, res) => {
  // #swagger.tags = ['Menu Items']
  // #swagger.summary = 'Update a menu item'
  try {
    const itemId = req.params.id;
    const updates = req.body;
    if (!itemId) {
      return res.status(400).json({ error: 'Item ID required' });
    }
    await dbUpdateMenuItem(itemId, updates);
    res.json({ message: 'Menu item updated' });
  } catch (error) {
    console.error('Failed to update menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

// =======================================
// Customer Controllers
// =======================================

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await dbGetCustomers();
    res.json({ customers });
  } catch (error) {
    console.error('Failed to get customers:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }
    const customer = await dbGetCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ customer });
  } catch (error) {
    console.error('Failed to get customer:', error);
    res.status(500).json({ error: 'Failed to get customer' });
  }
};

export const addCustomer = async (req, res) => {
  try {
    const customer = req.body;
    if (!customer || !customer.CustomerID) {
      return res.status(400).json({ error: 'Customer data missing or CustomerID required' });
    }
    await dbCreateCustomer(customer);
    res.status(201).json({ message: 'Customer created' });
  } catch (error) {
    console.error('Failed to create customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

export const modifyCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const updates = req.body;
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }
    await dbUpdateCustomer(customerId, updates);
    res.json({ message: 'Customer updated' });
  } catch (error) {
    console.error('Failed to update customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

export const removeCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }
    await dbDeleteCustomer(customerId);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    console.error('Failed to delete customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

export async function loginAdminUser(req, res){
  // console.log("Data from front end: ", req.body);

  const email = req.body.email;
  const password = req.body.password;

  const emailVerifier = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailVerifier.test(email)){
    return res.status(400).send("Please Enter a Valid Email");
  }

  const fetchedUser = await getSystemAdmin(email);

  if(fetchedUser === undefined){
    return res.status(401).send("Invalid Email or Password");
  }

  const correctPassword = await argon2.verify(fetchedUser.PasswordHash, password);

  if(!correctPassword){
    return res.status(401).send("Invalid Email or Password");
  }

  return res.status(200).json({
    authenticated: true,
  });
}

// =======================================
// Restaurant Staff Controllers
// =======================================

export async function loginRestaurantStaff(req, res) {
  // #swagger.tags = ['Restaurant Staff']
  // #swagger.summary = 'Login restaurant staff'
  try {
    const { email, password } = req.body;

    // Validate email format
    const emailVerifier = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVerifier.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email' });
    }

    // Fetch staff by email
    const staff = await getRestaurantStaffByEmail(email);

    if (!staff) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const correctPassword = await argon2.verify(staff.PasswordHash, password);

    if (!correctPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return staff details (excluding password hash)
    return res.status(200).json({
      authenticated: true,
      staff: {
        StaffID: staff.StaffID,
        Name: staff.Name,
        Email: staff.Email,
        Phone: staff.Phone,
        RestaurantID: staff.RestaurantID
      }
    });
  } catch (error) {
    console.error('Failed to login restaurant staff:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
}