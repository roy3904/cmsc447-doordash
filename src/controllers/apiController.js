import { getRestaurants, getMenuItemsByRestaurantId, createOrder, getCart as dbGetCart, addToCart as dbAddToCart, removeFromCart as dbRemoveFromCart, clearCart as dbClearCart, getMenuItem as dbGetMenuItem, getPlacedOrders, assignOrderToWorker, completeDeliveryJob, getWorkers, createWorker, declineOrderByWorker, deleteWorker, getSystemAdmin} from '../database.js';
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

export const getOrdersPlaced = async (req, res) => {
  try {
    const orders = await getPlacedOrders();
    res.json({ orders });
  } catch (error) {
    console.error('Failed to get placed orders:', error);
    res.status(500).json({ error: 'Failed to get placed orders' });
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

export const getAllWorkers = async (req, res) => {
  try {
    const workers = await getWorkers();
    res.json({ workers });
  } catch (error) {
    console.error('Failed to get workers:', error);
    res.status(500).json({ error: 'Failed to get workers' });
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

export const getCart = async (req, res) => {
  // #swagger.tags = ['Cart']
  // #swagger.summary = 'Get the current user\'s cart'
  try {
    const customerId = 'CUST-123'; // Hardcoded for now
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
    const customerId = 'CUST-123'; // Hardcoded for now
    const { itemId, quantity } = req.body;
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
    const customerId = 'CUST-123'; // Hardcoded for now
    const { itemId, quantity } = req.body;
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

export async function loginAdminUser(req, res){
  console.log("BUTTON CLICKED");
  console.log("Data from front end: ", req.body);

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

  res.json({
    authenticated: true,
  });
  return res.status(200).send("Successful Login Attempt");
}