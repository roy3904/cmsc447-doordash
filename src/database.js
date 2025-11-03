import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open Database Connection
async function openDb() {
  // Open connection to local SQLite database file
  return open({
    filename: './db/gritdash.db',
    driver: sqlite3.Database
  });
}

// ============================================
// Fetch All Restaurants from Restaurant Table
// ============================================
export async function getRestaurants() {
  let db;
  try {
    // Open database connection
    db = await openDb();

    // Execute query to fetch all restaurant records
    const restaurants = await db.all('SELECT * FROM Restaurant');

    // Return array of restaurant objects
    return restaurants;
  } catch (error) {
    // Log error if query fails
    console.error('Error getting restaurants:', error);
    throw error;
  } finally {
    // Always close the database connection
    if (db) {
      await db.close();
    }
  }
}

// ==================================================
// Fetch Menu Items Associated with a Specific Restaurant
// ==================================================
export async function getMenuItemsByRestaurantId(restaurantId) {
  let db;
  try {
    // Open database connection
    db = await openDb();

    // Fetch the MenuID linked to the given RestaurantID
    const menu = await db.get('SELECT MenuID FROM Menu WHERE RestaurantID = ?', restaurantId);

    // If no menu found, return empty list
    if (!menu) {
      return [];
    }

    // Fetch all items under the matched MenuID with a quantity greater than 0
    const menuItems = await db.all('SELECT * FROM MenuItem WHERE MenuID = ? AND Quantity > 0', menu.MenuID);

    // Return array of menu item objects
    return menuItems;
  } catch (error) {
    // Log any errors encountered during retrieval
    console.error(`Error getting menu items for restaurant ${restaurantId}:`, error);
    throw error;
  } finally {
    // Ensure connection is closed even if an error occurs
    if (db) {
      await db.close();
    }
  }
}

// =======================================
// Create New Order with Linked Order Items
// =======================================
export async function createOrder(order) {
  let db;
  try {
    // Open database connection
    db = await openDb();

    // Begin transaction
    // Check if an order with this ID already exists (e.g., a Cart)
    const existing = await db.get('SELECT * FROM "Order" WHERE OrderID = ?', order.id);
    const deliveryStr = JSON.stringify(order.delivery || {});
    if (existing && existing.OrderStatus === 'Cart') {
      // Transition existing cart to placed order
      await db.run('BEGIN TRANSACTION');
      await db.run('UPDATE "Order" SET DeliveryLocation = ?, OrderStatus = ?, TotalCost = ?, Tip = ? WHERE OrderID = ?', [deliveryStr, 'Placed', order.totalCost, order.tip, order.id]);
      await db.run('COMMIT');
      return order.id;
    }

    // Otherwise create a fresh placed order
    await db.run('BEGIN TRANSACTION');
    const orderResult = await db.run(
      'INSERT INTO "Order" (OrderID, CustomerID, RestaurantID, DeliveryLocation, OrderStatus, TotalCost, Tip) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        order.id,
        order.customerId,
        order.restaurantId,
        deliveryStr,
        'Placed',
        order.totalCost,
        order.tip
      ]
    );

    // Prepare insert order items statement
    const stmt = await db.prepare(
      'INSERT INTO OrderItem (OrderID, ItemID, Quantity, Price) VALUES (?, ?, ?, ?)'
    );

    // Loop through each ordered item, decrement quantity, and insert into OrderItem table
    for (const item of order.items) {
      await db.run('UPDATE MenuItem SET Quantity = Quantity - ? WHERE ItemID = ?', [item.quantity, item.id]);
      await stmt.run(order.id, item.id, item.quantity, item.price);
    }

    // Commit transaction once all inserts succeed
    await stmt.finalize();
    await db.run('COMMIT');

    // Return ID of newly created order
    return orderResult.lastID || order.id;
  } catch (error) {
    // Roll back transaction if an error occurs
    if (db) {
      await db.run('ROLLBACK');
    }

    // Log and rethrow error
    console.error('Error creating order:', error);
    throw error;
  } finally {
    // Always close the database connection
    if (db) {
      await db.close();
    }
  }
}

// =======================================
// Worker declines an order (record a declined DeliveryJob)
// =======================================
export async function declineOrderByWorker(orderId, workerId) {
  let db;
  try {
    db = await openDb();
    const jobId = 'JOB-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8).toUpperCase();
    const now = new Date().toISOString();
    await db.run('INSERT INTO DeliveryJob (JobID, OrderID, WorkerID, AcceptTime, JobStatus) VALUES (?, ?, ?, ?, ?)', [jobId, orderId, workerId, now, 'Declined']);
    return jobId;
  } catch (error) {
    console.error('Error declining order by worker:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// =======================================
// Get Orders with status 'Placed'
// =======================================
export async function getPlacedOrders() {
  let db;
  try {
    db = await openDb();
    const orders = await db.all('SELECT * FROM "Order" WHERE OrderStatus = ?', 'Placed');
    for (const o of orders) {
      o.items = await db.all('SELECT * FROM OrderItem WHERE OrderID = ?', o.OrderID);
      // try to parse delivery JSON
      try { o.delivery = JSON.parse(o.DeliveryLocation || '{}'); } catch (e) { o.delivery = { building: o.DeliveryLocation }; }
      // attach restaurant info
      o.restaurant = await db.get('SELECT * FROM Restaurant WHERE RestaurantID = ?', o.RestaurantID);
    }
    return orders;
  } catch (error) {
    console.error('Error getting placed orders:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// =======================================
// Assign an order to a worker (create DeliveryJob)
// =======================================
export async function assignOrderToWorker(orderId, workerId) {
  let db;
  try {
    db = await openDb();
    await db.run('BEGIN TRANSACTION');
    const jobId = 'JOB-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8).toUpperCase();
    const now = new Date().toISOString();
    await db.run('INSERT INTO DeliveryJob (JobID, OrderID, WorkerID, AcceptTime, JobStatus) VALUES (?, ?, ?, ?, ?)', [jobId, orderId, workerId, now, 'Accepted']);
    await db.run('UPDATE "Order" SET OrderStatus = ? WHERE OrderID = ?', ['Accepted', orderId]);
    await db.run('COMMIT');
    return jobId;
  } catch (error) {
    if (db) await db.run('ROLLBACK');
    console.error('Error assigning order to worker:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// =======================================
// Complete a delivery job
// =======================================
export async function completeDeliveryJob(jobId) {
  let db;
  try {
    db = await openDb();
    const now = new Date().toISOString();
    const job = await db.get('SELECT * FROM DeliveryJob WHERE JobID = ?', jobId);
    if (!job) throw new Error('Job not found');
    await db.run('BEGIN TRANSACTION');
    await db.run('UPDATE DeliveryJob SET CompletionTime = ?, JobStatus = ? WHERE JobID = ?', [now, 'Completed', jobId]);
    await db.run('UPDATE "Order" SET OrderStatus = ? WHERE OrderID = ?', ['Delivered', job.OrderID]);
    await db.run('COMMIT');
    return true;
  } catch (error) {
    if (db) await db.run('ROLLBACK');
    console.error('Error completing delivery job:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// =======================================
// Worker related helpers
// =======================================
export async function createWorker(worker) {
  let db;
  try {
    db = await openDb();
    await db.run('INSERT INTO Worker (WorkerID, AvailabilityStatus, Name, Email, Phone, PasswordHash) VALUES (?, ?, ?, ?, ?, ?)', [worker.WorkerID, worker.AvailabilityStatus || 'Available', worker.Name, worker.Email, worker.Phone || '', worker.PasswordHash || '']);
    return true;
  } catch (error) {
    console.error('Error creating worker:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

export async function getWorkers() {
  let db;
  try {
    db = await openDb();
    const workers = await db.all('SELECT * FROM Worker');
    return workers;
  } catch (error) {
    console.error('Error getting workers:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// =======================================
// Delete a worker by WorkerID
// =======================================
export async function deleteWorker(workerId) {
  let db;
  try {
    db = await openDb();
    await db.run('DELETE FROM Worker WHERE WorkerID = ?', workerId);
    return true;
  } catch (error) {
    console.error('Error deleting worker:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// =======================================
// Get active jobs for a worker
// =======================================
export async function getJobsForWorker(workerId) {
  let db;
  try {
    db = await openDb();
    // fetch jobs that are not completed (Accepted)
    const jobs = await db.all('SELECT * FROM DeliveryJob WHERE WorkerID = ? AND JobStatus = ?', [workerId, 'Accepted']);
    for (const job of jobs) {
      job.order = await db.get('SELECT * FROM "Order" WHERE OrderID = ?', job.OrderID);
      if (job.order) {
        job.items = await db.all('SELECT * FROM OrderItem WHERE OrderID = ?', job.OrderID);
        try { job.order.delivery = JSON.parse(job.order.DeliveryLocation || '{}'); } catch (e) { job.order.delivery = { building: job.order.DeliveryLocation }; }
        job.order.restaurant = await db.get('SELECT * FROM Restaurant WHERE RestaurantID = ?', job.order.RestaurantID);
      }
    }
    return jobs;
  } catch (error) {
    console.error('Error getting jobs for worker:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// =======================================
// Get Cart for a Customer
// =======================================
export async function getCart(customerId) {
  let db;
  try {
    db = await openDb();
    const cart = await db.get('SELECT * FROM "Order" WHERE CustomerID = ? AND OrderStatus = \'Cart\'', customerId);
    if (cart) {
      cart.items = await db.all('SELECT * FROM OrderItem WHERE OrderID = ?', cart.OrderID);
    }
    return cart;
  } catch (error) {
    console.error('Error getting cart:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// =======================================
// Add Item to Cart
// =======================================
export async function addToCart(customerId, itemId, quantity) {
  let db;
  try {
    db = await openDb();
    await db.run('BEGIN TRANSACTION');

    let cart = await db.get('SELECT * FROM "Order" WHERE CustomerID = ? AND OrderStatus = \'Cart\'', customerId);
    if (!cart) {
      const menuItem = await db.get('SELECT MenuID FROM MenuItem WHERE ItemID = ?', itemId);
      if (!menuItem) {
        throw new Error(`Item with ID ${itemId} not found`);
      }
      const menu = await db.get('SELECT RestaurantID FROM Menu WHERE MenuID = ?', menuItem.MenuID);
      const newOrderId = 'ORD-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      await db.run('INSERT INTO "Order" (OrderID, CustomerID, RestaurantID, OrderStatus) VALUES (?, ?, ?, ?)', [newOrderId, customerId, menu.RestaurantID, 'Cart']);
      cart = { OrderID: newOrderId };
    }

    const existingItem = await db.get('SELECT * FROM OrderItem WHERE OrderID = ? AND ItemID = ?', [cart.OrderID, itemId]);
    if (existingItem) {
      await db.run('UPDATE OrderItem SET Quantity = Quantity + ? WHERE OrderID = ? AND ItemID = ?', [quantity, cart.OrderID, itemId]);
    } else {
      const menuItem = await db.get('SELECT Price FROM MenuItem WHERE ItemID = ?', itemId);
      if (!menuItem) {
        throw new Error(`Item with ID ${itemId} not found`);
      }
      await db.run('INSERT INTO OrderItem (OrderID, ItemID, Quantity, Price) VALUES (?, ?, ?, ?)', [cart.OrderID, itemId, quantity, menuItem.Price]);
    }

    await db.run('UPDATE MenuItem SET Quantity = Quantity - ? WHERE ItemID = ?', [quantity, itemId]);

    await db.run('COMMIT');
  } catch (error) {
    if (db) {
      await db.run('ROLLBACK');
    }
    console.error('Error adding to cart:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// =======================================
// Remove Item from Cart
// =======================================
export async function removeFromCart(customerId, itemId, quantity) {
  let db;
  try {
    db = await openDb();
    await db.run('BEGIN TRANSACTION');

    const cart = await db.get('SELECT * FROM "Order" WHERE CustomerID = ? AND OrderStatus = \'Cart\'', customerId);
    if (cart) {
      const existingItem = await db.get('SELECT * FROM OrderItem WHERE OrderID = ? AND ItemID = ?', [cart.OrderID, itemId]);
      if (existingItem) {
        if (existingItem.Quantity > quantity) {
          await db.run('UPDATE OrderItem SET Quantity = Quantity - ? WHERE OrderID = ? AND ItemID = ?', [quantity, cart.OrderID, itemId]);
        } else {
          await db.run('DELETE FROM OrderItem WHERE OrderID = ? AND ItemID = ?', [cart.OrderID, itemId]);
        }
        await db.run('UPDATE MenuItem SET Quantity = Quantity + ? WHERE ItemID = ?', [quantity, itemId]);
      }
    }

    await db.run('COMMIT');
  } catch (error) {
    if (db) {
      await db.run('ROLLBACK');
    }
    console.error('Error removing from cart:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// =======================================
// Clear Cart for a Customer
// =======================================
export async function clearCart(customerId) {
  let db;
  try {
    db = await openDb();
    await db.run('BEGIN TRANSACTION');

    const cart = await db.get('SELECT * FROM "Order" WHERE CustomerID = ? AND OrderStatus = \'Cart\'', customerId);
    if (cart) {
      const items = await db.all('SELECT * FROM OrderItem WHERE OrderID = ?', cart.OrderID);
      for (const item of items) {
        await db.run('UPDATE MenuItem SET Quantity = Quantity + ? WHERE ItemID = ?', [item.Quantity, item.ItemID]);
      }
      await db.run('DELETE FROM OrderItem WHERE OrderID = ?', cart.OrderID);
    }

    await db.run('COMMIT');
  } catch (error) {
    if (db) {
      await db.run('ROLLBACK');
    }
    console.error('Error clearing cart:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// =======================================
// Get Menu Item
// =======================================
export async function getMenuItem(itemId) {
  let db;
  try {
    db = await openDb();
    const menuItem = await db.get('SELECT * FROM MenuItem WHERE ItemID = ?', itemId);
    if (menuItem) {
      const menu = await db.get('SELECT * FROM Menu WHERE MenuID = ?', menuItem.MenuID);
      if (menu) {
        menuItem.restaurant = await db.get('SELECT * FROM Restaurant WHERE RestaurantID = ?', menu.RestaurantID);
      }
    }
    return menuItem;
  } catch (error) {
    console.error('Error getting menu item:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}