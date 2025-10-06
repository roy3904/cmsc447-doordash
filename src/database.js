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
