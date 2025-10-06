import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'UMBC GritDash API',
    description: 'API documentation for UMBC GritDash',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/App.js'];

// Generate swagger.json
swaggerAutogen()(outputFile, endpointsFiles, doc);