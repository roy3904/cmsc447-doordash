import { getRestaurants, getMenuItemsByRestaurantId } from '../database.js';

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
