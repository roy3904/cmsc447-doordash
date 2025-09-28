import express from 'express';
import path from 'path';
import { getRestaurants } from './database.js';

// Create Express App
const app = express();
const port = 3000;

// Serve Static Files from "public"
app.use(express.static('public'));


// API Route to get all restaruants from the db
app.get('/api/restaurants', async (req, res) => {
  const restaurants = await getRestaurants();
  res.json({ restaurants });
});
// Route to serve homepage (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});
// Route to serve database page (database.html)
app.get('/database', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'database.html'));
});


// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
