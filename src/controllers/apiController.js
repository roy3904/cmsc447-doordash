import { getRestaurants, getMenuItemsByRestaurantId, createOrder } from '../database.js';

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
