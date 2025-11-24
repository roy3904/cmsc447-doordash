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

// ============================================
// Fetch Single Restaurant by ID
// ============================================
export async function getRestaurantById(restaurantId) {
  let db;
  try {
    db = await openDb();
    const restaurant = await db.get('SELECT * FROM Restaurant WHERE RestaurantID = ?', restaurantId);
    return restaurant;
  } catch (error) {
    console.error('Error getting restaurant:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// ============================================
// Create New Restaurant
// ============================================
export async function createRestaurant(restaurant) {
  let db;
  try {
    db = await openDb();
    await db.run(
      'INSERT INTO Restaurant (RestaurantID, Name, Location, OperatingHours) VALUES (?, ?, ?, ?)',
      [restaurant.RestaurantID, restaurant.Name, restaurant.Location, restaurant.OperatingHours]
    );
    return true;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// ============================================
// Update Restaurant Information
// ============================================
export async function updateRestaurant(restaurantId, updates) {
  let db;
  try {
    db = await openDb();
    const fields = [];
    const values = [];

    if (updates.Name !== undefined) {
      fields.push('Name = ?');
      values.push(updates.Name);
    }
    if (updates.Location !== undefined) {
      fields.push('Location = ?');
      values.push(updates.Location);
    }
    if (updates.OperatingHours !== undefined) {
      fields.push('OperatingHours = ?');
      values.push(updates.OperatingHours);
    }

    if (fields.length === 0) {
      return true;
    }

    values.push(restaurantId);
    const query = `UPDATE Restaurant SET ${fields.join(', ')} WHERE RestaurantID = ?`;
    await db.run(query, values);
    return true;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// ============================================
// Delete Restaurant
// ============================================
export async function deleteRestaurant(restaurantId) {
  let db;
  try {
    db = await openDb();
    await db.run('DELETE FROM Restaurant WHERE RestaurantID = ?', restaurantId);
    return true;
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  } finally {
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
// Update Order Status
// =======================================
export async function updateOrderStatus(orderId, newStatus) {
  let db;
  try {
    db = await openDb();

    // Validate status
    const validStatuses = ['Cart', 'Placed', 'Accepted', 'Ready for Pickup', 'Delivered'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}. Valid statuses are: ${validStatuses.join(', ')}`);
    }

    // Check if order exists
    const order = await db.get('SELECT * FROM "Order" WHERE OrderID = ?', orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Update the order status
    await db.run('UPDATE "Order" SET OrderStatus = ? WHERE OrderID = ?', [newStatus, orderId]);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
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
// Get single worker by WorkerID
// =======================================
export async function getWorkerById(workerId) {
  let db;
  try {
    db = await openDb();
    const worker = await db.get('SELECT * FROM Worker WHERE WorkerID = ?', workerId);
    return worker;
  } catch (error) {
    console.error('Error getting worker:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// =======================================
// Update worker details
// =======================================
export async function updateWorker(workerId, updates) {
  let db;
  try {
    db = await openDb();
    const fields = [];
    const values = [];

    if (updates.Name !== undefined) {
      fields.push('Name = ?');
      values.push(updates.Name);
    }
    if (updates.Email !== undefined) {
      fields.push('Email = ?');
      values.push(updates.Email);
    }
    if (updates.Phone !== undefined) {
      fields.push('Phone = ?');
      values.push(updates.Phone);
    }
    if (updates.AvailabilityStatus !== undefined) {
      fields.push('AvailabilityStatus = ?');
      values.push(updates.AvailabilityStatus);
    }
    if (updates.PasswordHash !== undefined) {
      fields.push('PasswordHash = ?');
      values.push(updates.PasswordHash);
    }

    if (fields.length === 0) {
      return true;
    }

    values.push(workerId);
    const query = `UPDATE Worker SET ${fields.join(', ')} WHERE WorkerID = ?`;
    await db.run(query, values);
    return true;
  } catch (error) {
    console.error('Error updating worker:', error);
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
// Worker Application Functions
// =======================================

// Create new worker application
export async function createWorkerApplication(application) {
  let db;
  try {
    db = await openDb();
    const applicationId = 'APP-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    await db.run(
      'INSERT INTO WorkerApplication (ApplicationID, WorkerID, Name, Email, Phone, Availability, PasswordHash, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [applicationId, application.WorkerID, application.Name, application.Email, application.Phone || '', application.Availability || '', application.PasswordHash, 'Pending']
    );
    return applicationId;
  } catch (error) {
    console.error('Error creating worker application:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// Get all worker applications with optional filtering, sorting, and pagination
export async function getWorkerApplications(options = {}) {
  let db;
  try {
    db = await openDb();

    const {
      status,        // Filter by status (Pending, Approved, Declined)
      search,        // Search in Name, Email, WorkerID
      sortBy = 'SubmittedAt',  // Sort field (default: SubmittedAt)
      sortOrder = 'DESC',      // Sort order (ASC or DESC)
      limit,         // Pagination limit
      offset = 0     // Pagination offset
    } = options;

    let query = 'SELECT * FROM WorkerApplication WHERE 1=1';
    const params = [];

    // Apply status filter
    if (status) {
      query += ' AND Status = ?';
      params.push(status);
    }

    // Apply search filter
    if (search) {
      query += ' AND (Name LIKE ? OR Email LIKE ? OR WorkerID LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Apply sorting
    const validSortFields = ['Name', 'Email', 'Status', 'SubmittedAt', 'WorkerID'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'SubmittedAt';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${order}`;

    // Apply pagination
    if (limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const applications = await db.all(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM WorkerApplication WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND Status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (Name LIKE ? OR Email LIKE ? OR WorkerID LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await db.get(countQuery, countParams);

    return {
      applications,
      total: countResult.total,
      limit: limit || countResult.total,
      offset: offset
    };
  } catch (error) {
    console.error('Error getting worker applications:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// Get worker application by ID
export async function getWorkerApplicationById(applicationId) {
  let db;
  try {
    db = await openDb();
    const application = await db.get('SELECT * FROM WorkerApplication WHERE ApplicationID = ?', applicationId);
    return application;
  } catch (error) {
    console.error('Error getting worker application:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// Update worker application status
export async function updateWorkerApplicationStatus(applicationId, status) {
  let db;
  try {
    db = await openDb();
    await db.run('UPDATE WorkerApplication SET Status = ? WHERE ApplicationID = ?', [status, applicationId]);
    return true;
  } catch (error) {
    console.error('Error updating worker application status:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// Update worker application details
export async function updateWorkerApplication(applicationId, updates) {
  let db;
  try {
    db = await openDb();
    const fields = [];
    const values = [];

    if (updates.Name !== undefined) {
      fields.push('Name = ?');
      values.push(updates.Name);
    }
    if (updates.Email !== undefined) {
      fields.push('Email = ?');
      values.push(updates.Email);
    }
    if (updates.Phone !== undefined) {
      fields.push('Phone = ?');
      values.push(updates.Phone);
    }
    if (updates.Availability !== undefined) {
      fields.push('Availability = ?');
      values.push(updates.Availability);
    }
    if (updates.Status !== undefined) {
      fields.push('Status = ?');
      values.push(updates.Status);
    }

    if (fields.length === 0) {
      return true;
    }

    values.push(applicationId);
    const query = `UPDATE WorkerApplication SET ${fields.join(', ')} WHERE ApplicationID = ?`;
    await db.run(query, values);
    return true;
  } catch (error) {
    console.error('Error updating worker application:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// Delete worker application
export async function deleteWorkerApplication(applicationId) {
  let db;
  try {
    db = await openDb();
    await db.run('DELETE FROM WorkerApplication WHERE ApplicationID = ?', applicationId);
    return true;
  } catch (error) {
    console.error('Error deleting worker application:', error);
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

// =======================================
// Update Menu Item
// =======================================
export async function updateMenuItem(itemId, updates) {
  let db;
  try {
    db = await openDb();
    const fields = [];
    const values = [];

    if (updates.Name !== undefined) {
      fields.push('Name = ?');
      values.push(updates.Name);
    }
    if (updates.Description !== undefined) {
      fields.push('Description = ?');
      values.push(updates.Description);
    }
    if (updates.Price !== undefined) {
      fields.push('Price = ?');
      values.push(updates.Price);
    }
    if (updates.Quantity !== undefined) {
      fields.push('Quantity = ?');
      values.push(updates.Quantity);
    }

    if (fields.length === 0) {
      return true;
    }

    values.push(itemId);
    const query = `UPDATE MenuItem SET ${fields.join(', ')} WHERE ItemID = ?`;
    await db.run(query, values);
    return true;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// =======================================
// Customer Management Functions
// =======================================

// Get all customers
export async function getCustomers() {
  let db;
  try {
    db = await openDb();
    const customers = await db.all('SELECT * FROM Customer');
    return customers;
  } catch (error) {
    console.error('Error getting customers:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// Get a single customer by ID
export async function getCustomerById(customerId) {
  let db;
  try {
    db = await openDb();
    const customer = await db.get('SELECT * FROM Customer WHERE CustomerID = ?', customerId);
    return customer;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// Create a new customer
export async function createCustomer(customer) {
  let db;
  try {
    db = await openDb();
    await db.run(
      'INSERT INTO Customer (CustomerID, Name, Email, Phone, PasswordHash) VALUES (?, ?, ?, ?, ?)',
      [
        customer.CustomerID,
        customer.Name,
        customer.Email,
        customer.Phone || '',
        customer.PasswordHash || ''
      ]
    );
    return true;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// Update customer information
export async function updateCustomer(customerId, updates) {
  let db;
  try {
    db = await openDb();
    const fields = [];
    const values = [];

    if (updates.Name !== undefined) {
      fields.push('Name = ?');
      values.push(updates.Name);
    }
    if (updates.Email !== undefined) {
      fields.push('Email = ?');
      values.push(updates.Email);
    }
    if (updates.Phone !== undefined) {
      fields.push('Phone = ?');
      values.push(updates.Phone);
    }
    if (updates.PasswordHash !== undefined) {
      fields.push('PasswordHash = ?');
      values.push(updates.PasswordHash);
    }

    if (fields.length === 0) {
      return true;
    }

    values.push(customerId);
    const query = `UPDATE Customer SET ${fields.join(', ')} WHERE CustomerID = ?`;
    await db.run(query, values);
    return true;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// Delete a customer
export async function deleteCustomer(customerId) {
  let db;
  try {
    db = await openDb();
    await db.run('DELETE FROM Customer WHERE CustomerID = ?', customerId);
    return true;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// =======================================
// System Admin Management Functions
// =======================================

// Get a system admin by email
export async function getSystemAdmin(email) {
  let db;
  try {
    db = await openDb();
    const admin = await db.get('SELECT * FROM SystemAdmin WHERE Email = ?', email);
    return admin;
  } catch (error) {
    console.error('Error getting system admin:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}