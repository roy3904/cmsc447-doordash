import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Swagger Docs
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger-output.json' with { type: 'json' };

// Routers
import apiRouter from './routes/api.js';
import pagesRouter from './routes/pages.js';

// Create path to the project directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express App
const app = express();
const port = 3000;

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')));

// Use Routers
app.use('/', pagesRouter);
app.use('/api', apiRouter);

// Serve Swagger UI Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${port}`);
});