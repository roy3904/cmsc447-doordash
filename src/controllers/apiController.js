import { getRestaurants, getMenuItemsByRestaurantId, createOrder, getCart as dbGetCart, addToCart as dbAddToCart, removeFromCart as dbRemoveFromCart, clearCart as dbClearCart, getMenuItem as dbGetMenuItem } from '../database.js';

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
