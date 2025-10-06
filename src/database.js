import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open db
async function openDb() {
  return open({
    filename: './db/gritdash.db',
    driver: sqlite3.Database
  });
}

// Fetch all restaurants from Restaurant table
export async function getRestaurants() {
  let db;
  try {
    // Open database connection
    db = await openDb();

    // Run SQL query to get all rows
    const restaurants = await db.all('SELECT * FROM Restaurant');

    // Return result as array of objects
    return restaurants;
  } catch (error) {
      console.error('Error getting restaurants:', error);
      throw error;
  } finally {
      // Ensure the database connection is closed
      if (db) {
        await db.close();
      }
  }
}

export async function getMenuItemsByRestaurantId(restaurantId) {
  let db;
  try {
    db = await openDb();
    const menu = await db.get('SELECT MenuID FROM Menu WHERE RestaurantID = ?', restaurantId);
    if (!menu) {
      return [];
    }
    const menuItems = await db.all('SELECT * FROM MenuItem WHERE MenuID = ?', menu.MenuID);
    return menuItems;
  } catch (error) {
    console.error(`Error getting menu items for restaurant ${restaurantId}:`, error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}
